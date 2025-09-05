const games = {}; // { chatId: { board, players, turn, symbols, active, botGame } }

module.exports = {
    name: 'tictactoe',
    description: 'Play Tic-Tac-Toe! Usage: .tictactoe @user X|O, .tictactoe bot X|O, .tictactoe start, or .tictactoe <cell>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        // Start vs bot: .tictactoe bot X|O
        if (args.length >= 2 && args[0].toLowerCase() === 'bot' && (args[1].toUpperCase() === 'X' || args[1].toUpperCase() === 'O')) {
            const playerSymbol = args[1].toUpperCase();
            const botSymbol = playerSymbol === 'X' ? 'O' : 'X';
            games[from] = {
                board: Array(9).fill(' '),
                players: [sender, 'bot'],
                symbols: { [sender]: playerSymbol, bot: botSymbol },
                turn: sender,
                active: true,
                botGame: true
            };
            await sock.sendMessage(from, {
                text: `🎮 Tic-Tac-Toe vs Bot!\n${this.renderBoard(games[from].board)}\n\nYou (${playerSymbol}) vs Bot (${botSymbol})\nYour turn! Play with: .tictactoe <cell 1-9>`
            }, { quoted: msg });
            return;
        }

        // Start vs bot: .tictactoe start
        if (args[0] && args[0].toLowerCase() === 'start') {
            games[from] = {
                board: Array(9).fill(' '),
                players: [sender, 'bot'],
                symbols: { [sender]: 'X', bot: 'O' },
                turn: sender,
                active: true,
                botGame: true
            };
            await sock.sendMessage(from, {
                text: `🎮 Tic-Tac-Toe vs Bot!\n${this.renderBoard(games[from].board)}\n\nYou (X) vs Bot (O)\nYour turn! Play with: .tictactoe <cell 1-9>`
            }, { quoted: msg });
            return;
        }

        // Start multiplayer: .tictactoe @user X|O
        if (args.length >= 2 && (args[1].toUpperCase() === 'X' || args[1].toUpperCase() === 'O')) {
            if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo || !msg.message.extendedTextMessage.contextInfo.mentionedJid) {
                return sock.sendMessage(from, { text: 'Please mention a user to play with.\nUsage: .tictactoe @user X|O' }, { quoted: msg });
            }
            const opponent = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            if (opponent === sender) {
                return sock.sendMessage(from, { text: 'You cannot play against yourself!' }, { quoted: msg });
            }
            const playerSymbol = args[1].toUpperCase();
            const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
            games[from] = {
                board: Array(9).fill(' '),
                players: [sender, opponent],
                symbols: { [sender]: playerSymbol, [opponent]: opponentSymbol },
                turn: sender,
                active: true,
                botGame: false
            };
            await sock.sendMessage(from, {
                text: `🎮 Tic-Tac-Toe started!\n${this.renderBoard(games[from].board)}\n\n${this.mention(sender)} (${playerSymbol}) vs ${this.mention(opponent)} (${opponentSymbol})\n\n${this.mention(sender)}'s turn (${playerSymbol}).\nPlay with: .tictactoe <cell 1-9>`,
                mentions: [sender, opponent]
            }, { quoted: msg });
            return;
        }

        // Make a move
        if (games[from] && games[from].active) {
            const game = games[from];
            if (!args[0] || isNaN(args[0])) {
                return sock.sendMessage(from, { text: 'Usage: .tictactoe <cell 1-9>' }, { quoted: msg });
            }
            const cell = parseInt(args[0]);
            if (cell < 1 || cell > 9 || game.board[cell - 1] !== ' ') {
                return sock.sendMessage(from, { text: 'Invalid move! Choose an empty cell (1-9).' }, { quoted: msg });
            }
            if (sender !== game.turn) {
                return sock.sendMessage(from, { text: `It's not your turn!` }, { quoted: msg });
            }
            // Make move
            game.board[cell - 1] = game.symbols[sender];
            // Check win
            if (this.checkWin(game.board, game.symbols[sender])) {
                game.active = false;
                await sock.sendMessage(from, {
                    text: this.renderBoard(game.board) + `\n\n🎉 ${game.botGame && sender === 'bot' ? 'Bot' : this.mention(sender)} (${game.symbols[sender]}) wins!`,
                    mentions: game.botGame ? [] : [sender]
                }, { quoted: msg });
                delete games[from];
                return;
            }
            // Check draw
            if (game.board.every(cell => cell !== ' ')) {
                game.active = false;
                await sock.sendMessage(from, { text: this.renderBoard(game.board) + `\n\n🤝 It's a draw!` }, { quoted: msg });
                delete games[from];
                return;
            }
            // Switch turn
            game.turn = game.players.find(p => p !== sender);

            // If playing vs bot and it's bot's turn, let bot play
            if (game.botGame && game.turn === 'bot') {
                const botMove = this.findBestMove(game.board, game.symbols['bot'], game.symbols[sender]);
                game.board[botMove] = game.symbols['bot'];
                // Check win
                if (this.checkWin(game.board, game.symbols['bot'])) {
                    game.active = false;
                    await sock.sendMessage(from, {
                        text: this.renderBoard(game.board) + `\n\n😈 Bot (${game.symbols['bot']}) wins!`,
                    }, { quoted: msg });
                    delete games[from];
                    return;
                }
                // Check draw
                if (game.board.every(cell => cell !== ' ')) {
                    game.active = false;
                    await sock.sendMessage(from, { text: this.renderBoard(game.board) + `\n\n🤝 It's a draw!` }, { quoted: msg });
                    delete games[from];
                    return;
                }
                // Switch back to player
                game.turn = sender;
                await sock.sendMessage(from, {
                    text: this.renderBoard(game.board) + `\n\nYour turn!`,
                }, { quoted: msg });
                return;
            }

            // Multiplayer: notify next player
            await sock.sendMessage(from, {
                text: this.renderBoard(game.board) + `\n\n${this.mention(game.turn)}'s turn (${game.symbols[game.turn]}).`,
                mentions: game.botGame ? [] : [game.turn]
            }, { quoted: msg });
            return;
        }

        // No active game
        await sock.sendMessage(from, { text: `No active game. Start one with: .tictactoe bot X|O, .tictactoe start, or .tictactoe @user X|O` }, { quoted: msg });
    },

    renderBoard(board) {
        return `
${board[0] === ' ' ? '1️⃣' : (board[0] === 'X' ? '❌' : '⭕')} | ${board[1] === ' ' ? '2️⃣' : (board[1] === 'X' ? '❌' : '⭕')} | ${board[2] === ' ' ? '3️⃣' : (board[2] === 'X' ? '❌' : '⭕')}
--------------------
${board[3] === ' ' ? '4️⃣' : (board[3] === 'X' ? '❌' : '⭕')} | ${board[4] === ' ' ? '5️⃣' : (board[4] === 'X' ? '❌' : '⭕')} | ${board[5] === ' ' ? '6️⃣' : (board[5] === 'X' ? '❌' : '⭕')}
--------------------
${board[6] === ' ' ? '7️⃣' : (board[6] === 'X' ? '❌' : '⭕')} | ${board[7] === ' ' ? '8️⃣' : (board[7] === 'X' ? '❌' : '⭕')} | ${board[8] === ' ' ? '9️⃣' : (board[8] === 'X' ? '❌' : '⭕')}
        `;
    },

    checkWin(board, player) {
        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        return wins.some(line => line.every(i => board[i] === player));
    },

    findBestMove(board, botSymbol, playerSymbol) {
        let bestScore = -Infinity;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (board[i] === ' ') {
                board[i] = botSymbol;
                let score = this.minimax(board, 0, false, botSymbol, playerSymbol);
                board[i] = ' ';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    },

    minimax(board, depth, isMaximizing, botSymbol, playerSymbol) {
        if (this.checkWin(board, botSymbol)) return 10 - depth;
        if (this.checkWin(board, playerSymbol)) return depth - 10;
        if (board.every(cell => cell !== ' ')) return 0;

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === ' ') {
                    board[i] = botSymbol;
                    best = Math.max(best, this.minimax(board, depth + 1, false, botSymbol, playerSymbol));
                    board[i] = ' ';
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === ' ') {
                    board[i] = playerSymbol;
                    best = Math.min(best, this.minimax(board, depth + 1, true, botSymbol, playerSymbol));
                    board[i] = ' ';
                }
            }
            return best;
        }
    },

    mention(jid) {
        return `@${jid.split('@')[0]}`;
    }
};