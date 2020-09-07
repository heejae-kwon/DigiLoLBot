package com.hjkwon93.digiLoLAPI

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import java.net.HttpURLConnection
import java.net.URL

object ChampionMap {
  val map = mutableMapOf<Int,String>()

  init {
    var gson = Gson()
    var jsonObj: JsonObject
    val url = URL("http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/champion.json")
    with(url.openConnection() as HttpURLConnection){
      requestMethod = "GET"
      jsonObj = JsonParser.parseString(inputStream.bufferedReader().readText()).asJsonObject
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