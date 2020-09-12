package com.hjkwon93.digiLoLAPI.controller

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.hjkwon93.digiLoLAPI.common.ChampionIdMap
import com.hjkwon93.digiLoLAPI.common.QueueType
import com.hjkwon93.digiLoLAPI.common.Summoner
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.net.HttpURLConnection
import java.net.URL

@RestController
@RequestMapping("/api/matches")
class MatchDataController {
  @Value("\${apikey}")
  private lateinit var apikey: String

  data class MatchlistDto(
          val startIndex: Int,
          val totalGames: Int,
          val endIndex: Int,
          val matches: List<MatchReferenceDto>
  )

  data class MatchReferenceDto(
          val gameId: Long,
          val role: String,
          val season: Int,
          val platformId: String,
          val champion: Int,
          val queue: Int,
          val lane: String,
          val timestamp: Long
  )

  fun getMatchList(encryptedAccountId: String): List<MatchReferenceDto> {
    val gson = Gson()
    var matchList = listOf<MatchReferenceDto>()
    val url = URL("https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/$encryptedAccountId?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection) {
      requestMethod = "GET"
      if (responseCode == HttpURLConnection.HTTP_OK) {
        val matchListObj = gson.fromJson(inputStream.bufferedReader().readText(), MatchlistDto::class.java)
        matchList = matchListObj.matches
      }
    }

    return matchList
  }


  data class MatchDto(
          val gameId: Long,
          val participantIdentities: List<ParticipantIdentityDto>,//	Participant identity information. Participant identity information is purposefully excluded for custom games.
          val queueId: Int, //	Please refer to the Game Constants documentation.
          val gameType: String, //	Please refer to the Game Constants documentation.
          val gameDuration: Long, //	Match duration in seconds.
          val teams: List<TeamStatsDto>, //	Team information.
          val platformId: String, //	Platform where the match was played.
          val gameCreation: Long, //	Designates the timestamp when champion select ended and the loading screen appeared, NOT when the game timer was at 0:00.
          val seasonId: Int, //	Please refer to the Game Constants documentation.
          val gameVersion: String, //	The major.minor version typically indicates the patch the match was played on.
          val mapId: Int, //	Please refer to the Game Constants documentation.
          val gameMode: String, //	Please refer to the Game Constants documentation.
          val participants: List<ParticipantDto> //	Participant information.
  )

  data class ParticipantIdentityDto(
          val participantId: Int,
          val player: PlayerDto  //Player information not included in the response for custom matches. Custom matches are considered private unless a tournament code was used to create the match.
  )

  data class PlayerDto(
          val profileIcon: Int,
          val accountId: String, //	Player's original accountId.
          val matchHistoryUri: String,
          val currentAccountId: String,  //Player's current accountId when the match was played.
          val currentPlatformId: String,  //Player's current platformId when the match was played.
          val summonerName: String,
          val summonerId: String,  //Player's summonerId (Encrypted)
          val platformId: String  //Player's original platformId.
  )

  data class TeamStatsDto(
          val owerKills: Int,  //Number of towers the team destroyed.
          val riftHeraldKills: Int,  //Number of times the team killed Rift Herald.
          val firstBlood: Boolean,  //Flag indicating whether or not the team scored the first blood.
          val inhibitorKills: Int,  //Number of inhibitors the team destroyed.
          val bans: List<TeamBansDto>,  //If match queueId has a draft, contains banned champion data, otherwise empty.
          val firstBaron: Boolean,  //Flag indicating whether or not the team scored the first Baron kill.
          val firstDragon: Boolean,  //Flag indicating whether or not the team scored the first Dragon kill.
          val dominionVictoryScore: Int,  //For Dominion matches, specifies the po:Int,s the team had at game end.
          val dragonKills: Int,  //Number of times the team killed Dragon.
          val baronKills: Int,  //Number of times the team killed Baron.
          val firstInhibitor: Boolean,  //Flag indicating whether or not the team destroyed the first inhibitor.
          val firstTower: Boolean,  //Flag indicating whether or not the team destroyed the first tower.
          val vilemawKills: Int,  //Number of times the team killed Vilemaw.
          val firstRiftHerald: Boolean,  //Flag indicating whether or not the team scored the first Rift Herald kill.
          val teamId: Int,  //100 for blue side. 200 for red side.
          val win: String  //String indicating whether or not the team won. There are only two values visibile in public match history. (Legal values: Fail, Win)
  )

  data class TeamBansDto(
          val championId: Int,  //Banned championId.
          val pickTurn: Int  //Turn during which the champion was banned.
  )

  data class ParticipantDto(
          val participantId: Int,
          val championId: Int,
          val runes: List<RuneDto>,  //List of legacy Rune information. Not included for matches played with Runes Reforged.
          val stats: ParticipantStatsDto,  //Participant statistics.
          val teamId: Int,  //100 for blue side. 200 for red side.
          val timeline: ParticipantTimelineDto,  //Participant timeline data.
          val spell1Id: Int,  //First Summoner Spell id.
          val spell2Id: Int,  //Second Summoner Spell id.
          val highestAchievedSeasonTier: String,  //Highest ranked tier achieved for the previous season in a specific subset of queueIds, if any, otherwise null. Used to display border in game loading screen. Please refer to the Ranked Info documentation. (Legal values: CHALLENGER, MASTER, DIAMOND, PLATINUM, GOLD, SILVER, BRONZE, UNRANKED)
          val masteries: List<MasteryDto>  //List of legacy Mastery information. Not included for matches played with Runes Reforged.
  )

  data class MasteryDto(
          val rank: Int,
          val masteryId: Int
  )

  data class RuneDto(
          val runeId: Int,
          val rank: Int
  )

  data class ParticipantStatsDto(
          val item0: Int,
          val item2: Int,
          val totalUnitsHealed: Int,
          val item1: Int,
          val largestMultiKill: Int,
          val goldEarned: Int,
          val firstInhibitorKill: Boolean,
          val physicalDamageTaken: Long,
          val nodeNeutralizeAssist: Int,
          val totalPlayerScore: Int,
          val champLevel: Int,
          val damageDealtToObjectives: Long,
          val totalDamageTaken: Long,
          val neutralMinionsKilled: Int,
          val deaths: Int,
          val tripleKills: Int,
          val magicDamageDealtToChampions: Long,
          val wardsKilled: Int,
          val pentaKills: Int,
          val damageSelfMitigated: Long,
          val largestCriticalStrike: Int,
          val nodeNeutralize: Int,
          val totalTimeCrowdControlDealt: Int,
          val firstTowerKill: Boolean,
          val magicDamageDealt: Long,
          val totalScoreRank: Int,
          val nodeCapture: Int,
          val wardsPlaced: Int,
          val totalDamageDealt: Long,
          val timeCCingOthers: Long,
          val magicalDamageTaken: Long,
          val largestKillingSpree: Int,
          val totalDamageDealtToChampions: Long,
          val physicalDamageDealtToChampions: Long,
          val neutralMinionsKilledTeamJungle: Int,
          val totalMinionsKilled: Int,
          val firstInhibitorAssist: Boolean,
          val visionWardsBoughtInGame: Int,
          val objectivePlayerScore: Int,
          val kills: Int,
          val firstTowerAssist: Boolean,
          val combatPlayerScore: Int,
          val inhibitorKills: Int,
          val turretKills: Int,
          val participantId: Int,
          val trueDamageTaken: Long,
          val firstBloodAssist: Boolean,
          val nodeCaptureAssist: Int,
          val assists: Int,
          val teamObjective: Int,
          val altarsNeutralized: Int,
          val goldSpent: Int,
          val damageDealtToTurrets: Long,
          val altarsCaptured: Int,
          val win: Boolean,
          val totalHeal: Long,
          val unrealKills: Int,
          val visionScore: Long,
          val physicalDamageDealt: Long,
          val firstBloodKill: Boolean,
          val longestTimeSpentLiving: Int,
          val killingSprees: Int,
          val sightWardsBoughtInGame: Int,
          val trueDamageDealtToChampions: Long,
          val neutralMinionsKilledEnemyJungle: Int,
          val doubleKills: Int,
          val trueDamageDealt: Long,
          val quadraKills: Int,
          val item4: Int,
          val item3: Int,
          val item6: Int,
          val item5: Int,
          val playerScore0: Int,
          val playerScore1: Int,
          val playerScore2: Int,
          val playerScore3: Int,
          val playerScore4: Int,
          val playerScore5: Int,
          val playerScore6: Int,
          val playerScore7: Int,
          val playerScore8: Int,
          val playerScore9: Int,
          val perk0: Int,  //Primary path keystone rune.
          val perk0Var1: Int,  //Post game rune stats.
          val perk0Var2: Int,  //Post game rune stats.
          val perk0Var3: Int,  //Post game rune stats.
          val perk1: Int,  //Primary path rune.
          val perk1Var1: Int,  //Post game rune stats.
          val perk1Var2: Int,  //Post game rune stats.
          val perk1Var3: Int,  //Post game rune stats.
          val perk2: Int,  //Primary path rune.
          val perk2Var1: Int,  //Post game rune stats.
          val perk2Var2: Int,  //Post game rune stats.
          val perk2Var3: Int,  //Post game rune stats.
          val perk3: Int,  //Primary path rune.
          val perk3Var1: Int,  //Post game rune stats.
          val perk3Var2: Int,  //Post game rune stats.
          val perk3Var3: Int,  //Post game rune stats.
          val perk4: Int,  //Secondary path rune.
          val perk4Var1: Int,  //Post game rune stats.
          val perk4Var2: Int,  //Post game rune stats.
          val perk4Var3: Int,  //Post game rune stats.
          val perk5: Int,  //Secondary path rune.
          val perk5Var1: Int,  //Post game rune stats.
          val perk5Var2: Int,  //Post game rune stats.
          val perk5Var3: Int,  //Post game rune stats.
          val perkPrimaryStyle: Int,  //Primary rune path
          val perkSubStyle: Int  //Secondary rune path
  )

  data class ParticipantTimelineDto(
          val participantId: Int,
          val csDiffPerMinDeltas: Map<String, Double>,  //Creep score difference versus the calculated lane opponent(s) for a specified period.
          val damageTakenPerMinDeltas: Map<String, Double>,  //Damage taken for a specified period.
          val role: String,  //Participant's calculated role. (Legal values: DUO, NONE, SOLO, DUO_CARRY, DUO_SUPPORT)
          val damageTakenDiffPerMinDeltas: Map<String, Double>,  //Damage taken difference versus the calculated lane opponent(s) for a specified period.
          val xpPerMinDeltas: Map<String, Double>,  //Experience change for a specified period.
          val xpDiffPerMinDeltas: Map<String, Double>,  //Experience difference versus the calculated lane opponent(s) for a specified period.
          val lane: String,  //Participant's calculated lane. MID and BOT are legacy values. (Legal values: MID, MIDDLE, TOP, JUNGLE, BOT, BOTTOM)
          val creepsPerMinDeltas: Map<String, Double>, //Creeps for a specified period.
          val goldPerMinDeltas: Map<String, Double>  //Gold for a specified period.
  )

  fun getGameData(matchId: Long): MatchDto? {
    val gson = Gson()
    val url = URL("https://kr.api.riotgames.com/lol/match/v4/matches/$matchId?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection) {
      requestMethod = "GET"
      if (responseCode == HttpURLConnection.HTTP_OK) {
        return gson.fromJson(inputStream.bufferedReader().readText(), MatchDto::class.java)
      }
    }

    return null
  }

  @GetMapping("")
  fun index(@RequestParam(value = "summonerName", required = true) summonerName: String): String {
    val gson = Gson()
    val lolId = summonerName.replace(" ", "%20")
    val summoner = Summoner.getSummoner(lolId, apikey) ?: return "{error: \"Fail searching summoner\"}"
    val matchList = getMatchList(summoner.accountId)

    val matchObjList = mutableListOf<JsonObject>()
    val matchSize = if(matchList.size > 10) 10 else matchList.size
    var winCount = 0
    for (i in 0 until matchSize) {
      val match = matchList[i]
      if(match.queue !in 400..450){
        continue
      }
      //queueType
      val champId = match.champion
      val gameData = getGameData(match.gameId) ?: return "{error: \"Cannot get game data\"}"
      val champInfo = gameData.participants.find { it.championId == champId }

      val matchObj = JsonObject()
      matchObj.add("champion", gson.toJsonTree(ChampionIdMap.map[champId]))
      matchObj.add("kills", gson.toJsonTree(champInfo?.stats?.kills))
      matchObj.add("deaths", gson.toJsonTree(champInfo?.stats?.deaths))
      matchObj.add("assists", gson.toJsonTree(champInfo?.stats?.assists))
      matchObj.add("win", gson.toJsonTree(champInfo?.stats?.win))
      matchObj.add("queueType", gson.toJsonTree(QueueType.map[match.queue]))
      if(champInfo?.stats?.win!!){
        ++winCount
      }

      matchObjList.add(matchObj)
    }

    val returnObj = JsonObject()
    returnObj.add("icon",gson.toJsonTree( summoner.profileIconId))
    returnObj.add("name", gson.toJsonTree(summoner.name))
    returnObj.add("wins", gson.toJsonTree(winCount))
    returnObj.add("loses", gson.toJsonTree(matchSize-winCount))
    returnObj.add("matches", gson.toJsonTree(matchObjList))
    return returnObj.toString()
  }


}

