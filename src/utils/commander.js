const commander = require('commander')

const program = new commander.Command()
program
    .option('-m, --mode <mode>', 'Specify the mode (development/production)')
    .parse(process.argv)

module.exports = {
    program,
}
