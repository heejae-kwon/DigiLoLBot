package DigiLoLAPI.controller

import com.google.gson.Gson
import com.google.gson.JsonObject
import DigiLoLAPI.common.ChampionIdMap
import DigiLoLAPI.common.LeagueEntry
import DigiLoLAPI.common.QueueType
import DigiLoLAPI.common.Summoner
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.HttpURLConnection
import java.net.URL

@RestController
@RequestMapping("/api/spectator")
class SpectatorController {
  @Value("\${apikey}")
  private lateinit var apikey: String

  data class CurrentGameInfo(
          val gameId: Long,  //The ID of the game
          val gameType: String,  //The game type
          val gameStartTime: Long,  //The game start time represented in epoch milliseconds
          val mapId: Long,  //The ID of the map
          val gameLength: Long,  //The amount of time in seconds that has passed since the game started
          val platformId: String,  //The ID of the platform on which the game is being played
          val gameMode: String,  //The game mode
          val bannedChampions: List<BannedChampion>,  //Banned champion information
          val gameQueueConfigId: Long,  //The queue type (queue types are documented on the Game Constants page)
          val observers: Observer,  //The observer information
          val participants: List<CurrentGameParticipant>  //The participant information
  )

  data class BannedChampion(
          val pickTurn: Int,  //The turn during which the champion was banned
          val championId: Long,  //The ID of the banned champion
          val teamId: Long  //The ID of the team that banned the champion
  )

  data class Observer(
          val encryptionKey: String
  )

  data class CurrentGameParticipant(
          val championId: Long,  //The ID of the champion played by this participant
          val perks: Perks,  //Perks/Runes Reforged Information
          val profileIconId: Long,  //The ID of the profile icon used by this participant
          val bot: Boolean,  //Flag indicating whether or not this participant is a bot
          val teamId: Long,  //The team ID of this participant, indicating the participant's team
          val summonerName: String,  //The summoner name of this participant
          val summonerId: String,  //The encrypted summoner ID of this participant
          val spell1Id: Long,  //The ID of the first summoner spell used by this participant
          val spell2Id: Long,  //The ID of the second summoner spell used by this participant
          val gameCustomizationObjects: List<GameCustomizationObject>  //List of Game Customizations
  )

  data class Perks(
          val perkIds: List<Long>,  //IDs of the perks/runes assigned.
          val perkStyle: Long,  //Primary runes path
          val perkSubStyle: Long  //Secondary runes path
  )

  data class GameCustomizationObject(
          val category: String,  //Category identifier for Game Customization
          val content: String  //Game Customization content
  )

  fun getCurrentGameInfo(encryptedId: String): CurrentGameInfo?{
    val gson = Gson()
    val url = URL("https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/$encryptedId?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection) {
      requestMethod = "GET"
      if (responseCode == HttpURLConnection.HTTP_OK) {
        return gson.fromJson(inputStream.bufferedReader().readText(), CurrentGameInfo::class.java)
      }
    }

    return null

  }

  @GetMapping("")
  fun index(@RequestParam(value = "summonerName", required = true) summonerName: String): String {
    val gson = Gson()
    val lolId = summonerName.replace(" ", "%20")
    val summoner = Summoner.getSummoner(lolId, apikey) ?: return "{error: \"Fail searching summoner\"}"
    val currentGameInfo = getCurrentGameInfo(summoner.id) ?: return "{error: \"Cannot find current game info\"}"
    if(currentGameInfo.gameQueueConfigId !in 400..450){
      return "{error: \"Does not support this type of game\"}"
    }
    val returnObj = JsonObject()
    val blueParticipants = mutableListOf<JsonObject>()
    val redParticipants = mutableListOf<JsonObject>()
    val blueBanList = mutableListOf<String>()
    val redBanList = mutableListOf<String>()
    val blueObj = JsonObject()
    val redObj = JsonObject()

    for(player in currentGameInfo.participants){
      val playerObj = JsonObject()
      playerObj.add("championName", gson.toJsonTree(ChampionIdMap.map[player.championId.toInt()]))
      playerObj.add("summonerName", gson.toJsonTree(player.summonerName))
      val leagueEntries = LeagueEntry.getLeagueEntries(player.summonerId,apikey)
      val soloEntry = leagueEntries.find { it.queueType == "RANKED_SOLO_5x5" }
      if(soloEntry != null) {
        playerObj.add("tier", gson.toJsonTree(soloEntry.tier))
        playerObj.add("rank", gson.toJsonTree(soloEntry.rank))
      }
      when (player.teamId.toInt()){
        100-> blueParticipants.add(playerObj)
        200-> redParticipants.add(playerObj)
      }
    }

    for(banChamp in currentGameInfo.bannedChampions){
      if(banChamp.championId.toInt() < 0){
        continue
      }
      val name = ChampionIdMap.map[banChamp.championId.toInt()]!!
      when (banChamp.teamId.toInt()){
        100-> blueBanList.add(name)
        200-> redBanList.add(name)
      }
    }

    blueObj.add("teamName",gson.toJsonTree("blue"))
    blueObj.add("participants",gson.toJsonTree(blueParticipants))
    blueObj.add("bannedChampions",gson.toJsonTree(blueBanList))
    redObj.add("teamName",gson.toJsonTree("red"))
    redObj.add("participants",gson.toJsonTree(redParticipants))
    redObj.add("bannedChampions",gson.toJsonTree(redBanList))
    val teamObjList = listOf<JsonObject>(blueObj,redObj)

    returnObj.add("team", gson.toJsonTree(teamObjList))
    returnObj.add("gameStartTime", gson.toJsonTree(currentGameInfo.gameStartTime))
    returnObj.add("gameLength", gson.toJsonTree(currentGameInfo.gameLength))
    returnObj.add("queueType", gson.toJsonTree(QueueType.map[currentGameInfo.gameQueueConfigId.toInt()]))

    return returnObj.toString()
  }

}

