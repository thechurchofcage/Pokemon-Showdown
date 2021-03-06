'use strict';

const assert = require('../../assert').strict;
const TeamValidator = require('../../../.sim-dist/team-validator').TeamValidator;
const factorySets = require('../../../data/mods/cfm/cfm-factory-sets');

describe('CFM - Factory Validator', function () {
	it('CFM should be a valid format', function () {
		try {
			Dex.getRuleTable(Dex.getFormat('gen8cfmou'));
		} catch (e) {
			e.message = `gen8cfmou: ${e.message}`;
			throw e;
		}
	});
	it('Validate all factory sets', function () {
		let illegalSets = `\nCFM FACTORY ILLEGAL SETS\n\n`,
			illegalSetsFound = false;
		const tiers = {'Uber': 'ubers', 'OU': 'ou', 'UU': 'uu', 'RU': 'ru', 'NU': 'nu', 'PU': 'pu'};
		for (const tier in factorySets) {
			illegalSets += `\\\\ ${tier} \\\\\n\n`;
			for (const mon in factorySets[tier]) {
				for (const subSet in factorySets[tier][mon]["sets"]) {
					const rawSet		= factorySets[tier][mon]["sets"][subSet];
					const validateSets	= [];

					for (const field of ['nature', 'item', 'ability']) {
						if (typeof rawSet[field] === 'object') rawSet[field] = rawSet[field][0];
					}

					const moves = rawSet.moves.flat();
					let i = 0;
					while (moves.length > i) {
						validateSets.push({...rawSet, moves: moves.splice(i, i + 4)});
						i += 4;
					}

					let team, illegal = null;
					for (const validateSet of validateSets) {
						team = [validateSet];
						illegal = TeamValidator.get(`gen8cfm${tiers[tier]}`).validateTeam(team);
						if (illegal) {
							illegalSetsFound = true;
							illegalSets += `${tier} - ${mon} : ${illegal}\n`;
						}
					}
				}
			}
		}
		assert(!illegalSetsFound, illegalSets);
	});
});
