package com.hjkwon93.digiLoLAPI.controller

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.hjkwon93.digiLoLAPI.common.ChampionIdMap
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.HttpURLConnection
import java.net.URL

@RestController
@RequestMapping("/api/champion-rotations")
class ChampionRotationController {
  @Value("\${apikey}")
 private lateinit var apikey : String

  data class ChampionInfo(
          val maxNewPlayerLevel: Int,
          val freeChampionIdsForNewPlayers : List<Int>,
          val freeChampionIds : List<Int>
  )

  @GetMapping("")
  fun index() : String {
    val gson = Gson()

    var jsonString: String
    val url = URL("https://kr.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection){
      requestMethod = "GET"
      if(responseCode != HttpURLConnection.HTTP_OK) {
        return "{error: \"Fail getting rotations\"}"
      }
      jsonString = inputStream.bufferedReader().readText()
    }
    var champInfo = gson.fromJson(jsonString, ChampionInfo::class.java)
    val champList = mutableListOf<String>()
    champInfo.freeChampionIds.forEach{e->
      run {
        champList.add(ChampionIdMap.map[e]!!)
      }
    }
    val jo = JsonObject()
    jo.add("Champion List", gson.toJsonTree(champList))

    return jo.toString()
  }
}
