import {
	ApplicationCommandOptionType,
	CommandInteraction,
	PermissionsBitField,
	inlineCode
} from 'discord.js';
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';
import { prisma } from '..';

@Discord()
export class Transform {
	@Slash({ description: 'Change your nickname transformation settings' })
	async transform(
		@SlashChoice({ name: 'Normal - Disables the bot', value: 0 })
		@SlashChoice({ name: 'Lowercase - Makes all usernames lowercase', value: 1 })
		@SlashChoice({ name: 'Uppercase -  Makes all usernames uppercase', value: 2 })
		@SlashChoice({ name: 'Spaces - Adds spaces between each letter', value: 3 })
		@SlashChoice({ name: 'Alternating - Makes names look like tHiS', value: 4 })
		@SlashOption({
			description: 'The transformation option',
			name: 'option',
			required: true,
			type: ApplicationCommandOptionType.Number
		})
		option: number,
		interaction: CommandInteraction
	) {
		await interaction.deferReply({
			ephemeral: true
		});

		const permissions = interaction.member.permissions as Readonly<PermissionsBitField>;

		if (!permissions.has('ManageGuild')) {
			interaction.editReply({
				content: `❌ This command is only for people with ${inlineCode(
					'MANAGE_SERVER'
				)} permissions`
			});
			return;
		}

		await prisma.guild.update({
			where: {
				id: interaction.guildId
			},
			data: {
				transformMode: option
			}
		});

		interaction.editReply({
			content: '✅ Successfully changed settings'
		});
	}
}
