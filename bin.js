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

const log = message => process.stdout.write(`${message}\n`);

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

	log(`Check if ${name}@${version} was already published...`);
	const exists = await execute(`npm view ${name}@${version} version`);

	if (exists) {
		const latest = await execute(`npm info ${name}@latest version`);
		if (latest !== version) {
			log(`Set ${version} as latest instead of ${latest}`);
			await exec(`npm dist-tag add ${name}@${version} latest`)
		} else {
			log(' ...yup');
		}

		return;
	}

	log('');

	await exec('npm publish');
};
