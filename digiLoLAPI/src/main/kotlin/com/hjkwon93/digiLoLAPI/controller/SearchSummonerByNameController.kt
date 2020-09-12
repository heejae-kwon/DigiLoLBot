package com.hjkwon93.digiLoLAPI.controller

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.hjkwon93.digiLoLAPI.common.ChampionIdMap
import com.hjkwon93.digiLoLAPI.common.LeagueEntry
import com.hjkwon93.digiLoLAPI.common.Summoner
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.*
import java.net.HttpURLConnection
import java.net.URL

@RestController
@RequestMapping("/api/search-summoner")
class SearchSummonerByNameController {
  @Value("\${apikey}")
   private lateinit var apikey : String

  data class ChampionMasteryDTO(
          val championPointsUntilNextLevel	:Long,
          val chestGranted	:Boolean,
          val championId	:Long,
          val lastPlayTime	:Long,
          val championLevel	:Int,
          val summonerId	:String,
          val championPoints	:Int,
          val championPointsSinceLastLevel	:Long,
          val tokensEarned	:Int
  )


  fun getBestChampionMastery(encryptedSummonerId: String, apikey: String): ChampionMasteryDTO? {
    val gson = Gson()
    val url = URL("https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/$encryptedSummonerId?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection){
      requestMethod = "GET"
      if(responseCode == HttpURLConnection.HTTP_OK) {
        val res = JsonParser.parseString(inputStream.bufferedReader().readText()).asJsonArray

        if(res.size() > 0) {
          return gson.fromJson(res[0].asJsonObject.toString(), ChampionMasteryDTO::class.java)
        }
      }
    }
    return null
  }

  @GetMapping("")
  fun index(@RequestParam(value = "summonerName", required = true) summonerName: String) : String {
    val lolId =  summonerName.replace(" ","%20")
    val summoner = Summoner.getSummoner(lolId, apikey) ?: return "{error: \"Fail searching summoner\"}"
    val leagueEntries =
            LeagueEntry.getLeagueEntries(summoner.id, apikey) ?: return "{error: \"Fail loading league entry\"}"
    val bestChampMastery =
            getBestChampionMastery(summoner.id, apikey) ?: return "{error: \"Fail loading champ mastery\"}"

    val gson = Gson()
    val rankList = mutableListOf<JsonObject>()

    for (entry in leagueEntries) {
      val obj = JsonObject()
      obj.add("tier", gson.toJsonTree(entry.tier+" "+entry.rank))
      obj.add("leaguePoints",gson.toJsonTree(entry.leaguePoints) )
      obj.add("wins",gson.toJsonTree(entry.wins) )
      obj.add("loses",gson.toJsonTree(entry.losses) )
      obj.add("queueType",gson.toJsonTree(entry.queueType) )
      rankList.add(obj)
    }

    val returnObj = JsonObject()
    returnObj.add("icon", gson.toJsonTree(summoner.profileIconId))
    returnObj.add("name", gson.toJsonTree(summoner.name))
    returnObj.add("level", gson.toJsonTree(summoner.summonerLevel))
    returnObj.add("bestChampion", gson.toJsonTree(ChampionIdMap.map[bestChampMastery.championId.toInt()]))
    returnObj.add("rank", gson.toJsonTree(rankList))

    return returnObj.toString()
  }
}
