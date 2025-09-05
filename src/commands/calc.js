const {evaluate, e} = require('mathjs');

module.exports = {
    name: 'calc',
    description: 'Performs basic arithmetic calculations. Usage: .calc <expression>',
    async execute(sock, msg, args, botName, ownerNumber, prefix) {
        const from = msg.key.remoteJid;
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: '❗ Please provide an expression to calculate. Usage: .calc <expression>\n *NB* Multiply is (*) and Divide is (/)' }, { quoted: msg });
        }
        const expression = args.join(' ');
        try{
            // Evaluate the expression safely
            const result = evaluate(expression);
            if (result === undefined) {
                throw new Error('❌ Invalid expression');
            }
            await sock.sendMessage(from, { text: `🧮 The result of *${expression}* is: *${result}*` }, { quoted: msg });

        }catch (error) {
            console.error('Error evaluating expression:', error);
            await sock.sendMessage(from, { text: '❌ Invalid expression. Please ensure your expression is valid and try again.' }, { quoted: msg });
        }
    }
}