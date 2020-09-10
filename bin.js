#!/usr/bin/env node

const { resolve } = require('path');
const execute = require('async-execute');
const manual = require('./manual');

const [, , ...args] = process.argv;

const options = args.reduce(
	(accumulator, arg) => {
		if (arg.startsWith('--')) {
			accumulator[arg.replace(/^--/, '').toLowerCase()] = true;
		}
		return accumulator;
	},
	{}
);

start();

async function start() {
	if (options.help) {
		await manual();
		return;
	}

	const { name, version } = require(resolve('./package.json'));
	const exec = options['dry-run']
		? command => console.log(`$ ${command}`)
		: command => execute(command, { pipe: true, exit: true })
	;

	process.stdout.write(`Check if ${name}@${version} was already published...`);
	const exists = await execute(`npm view ${name}@${version} version`);

	if (exists) {
		process.stdout.write(' ...yup\n');
		return;
	}

	process.stdout.write('\n');

	await exec('npm publish');
};
