package com.hjkwon93.digiLoLAPI.common

import com.google.gson.JsonParser
import java.net.HttpURLConnection
import java.net.URL

object ChampionIdMap {
 val map = mutableMapOf<Int,String>()

  init {
    val url = URL("https://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/champion.json")
    with(url.openConnection() as HttpURLConnection){
      requestMethod = "GET"
      val jsonObj = JsonParser.parseString(inputStream.bufferedReader().readText()).asJsonObject
      val data = jsonObj.get("data").asJsonObject
      val keys = data.keySet()
      keys.forEach{champName->
        run {
          val champId = data.get(champName).asJsonObject.get("key").asInt
          map.put(champId,champName.toString())
        }
      }
    }
  }
}