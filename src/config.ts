import 'dotenv/config'

export const config = {
    token: process.env.TOKEN ?? '',
    id: process.env.DISCORD_ID ?? '',
    discordAuthUrl: 'https://discord.com/oauth2/authorize?scope=identify%20guilds%20email&redirect_uri=https%3A%2F%2Ftop.gg%2Flogin%2Fcallback&response_type=code&client_id=422087909634736160&state=L2JvdC80MzI2MTAyOTIzNDI1ODczOTIvdm90ZQ==',
    discordUrl: "https://discord.com/login",
    topGGUrl: "https://top.gg/bot/432610292342587392/vote"
}