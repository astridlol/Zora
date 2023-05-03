import { ArgsOf, Discord, On } from 'discordx';
import { prisma } from '..';

@Discord()
export class GuildEvents {
	@On({
		event: 'guildCreate'
	})
	async onJoin([guild]: ArgsOf<'guildCreate'>) {
		await prisma.guild.create({
			data: {
				id: guild.id
			}
		});
	}

	@On({
		event: 'guildDelete'
	})
	async onLeave([guild]: ArgsOf<'guildDelete'>) {
		await prisma.guild.delete({
			where: {
				id: guild.id
			}
		});
	}
}
