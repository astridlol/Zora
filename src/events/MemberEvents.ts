import { ArgsOf, Discord, On } from 'discordx';
import updateNickname from '../lib/updateNickname';

@Discord()
export class MemberEvents {
	@On({ event: 'guildMemberUpdate' })
	async onUpdate(
		[oldMember, newMember]: ArgsOf<'guildMemberUpdate'> // Type members automatically
	) {
		// ignore bots
		if (oldMember.user.bot) return;
		if (oldMember.nickname === newMember.nickname) return;

		updateNickname(newMember);
	}

	@On({
		event: 'guildMemberAdd'
	})
	async onJoin(
		[member]: ArgsOf<'guildMemberAdd'> // Type member automatically
	) {
		if (member.user.bot) return;
		updateNickname(member);
	}
}
