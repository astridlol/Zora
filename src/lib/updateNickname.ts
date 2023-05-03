import { GuildMember } from 'discord.js';
import { prisma } from '..';
import TransformMode from '../enums/TransformMode';
import NodeCache from 'node-cache';

const updateCache = new NodeCache({ stdTTL: 5 });

export default async function updateNickname(member: GuildMember): Promise<boolean> {
	if (!member.manageable) {
		console.log(`this member isn't manageable`);
		return false;
	}

	// Prevents inf loops
	if (updateCache.has(member.user.id)) {
		console.log(`[CACHE] Hit for ${member.user.id}`);
		return;
	}

	const guildInfo = await prisma.guild.findFirst({
		where: {
			id: member.guild.id
		}
	});

	if (guildInfo.transformMode === TransformMode.NORMAL) return false;

	let newNickname = member.displayName;

	switch (guildInfo.transformMode) {
		case TransformMode.NORMAL:
			break;
		case TransformMode.LOWERCASE: {
			newNickname = newNickname.toLowerCase();
			break;
		}
		case TransformMode.UPPERCASE: {
			newNickname = newNickname.toUpperCase();
			break;
		}
		case TransformMode.TITLECASE: {
			newNickname = newNickname
				.split(' ')
				.map((word) => word[0].toUpperCase() + word.substring(1))
				.join(' ');
			break;
		}
		case TransformMode.SPACES: {
			let oldName = newNickname;

			newNickname = newNickname.split('').join('');

			// Enforces name size limitations
			if (newNickname.length >= 32) newNickname = oldName;

			break;
		}
		case TransformMode.ALTERNATING: {
			newNickname = [...newNickname]
				.map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
				.join('');
			break;
		}
	}

	await member.setNickname(newNickname, 'Changed name to follow nickname guidelines.');

	await prisma.statistics.update({
		where: {
			id: 1
		},
		data: {
			totalTransformations: {
				increment: 1
			}
		}
	});

	await updateCache.set(member.user.id, true);

	return true;
}
