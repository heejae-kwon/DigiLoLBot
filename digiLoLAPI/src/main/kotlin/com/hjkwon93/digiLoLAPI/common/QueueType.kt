package com.hjkwon93.digiLoLAPI.common

import com.google.gson.Gson
import com.google.gson.JsonParser
import java.net.HttpURLConnection
import java.net.URL

object QueueType {
  val map = mutableMapOf<Int, String>()

  data class QueueDTO(
          val queueId: Int,
          val map: String,
          val description: String,
          val notes: String
  )

  init {
    val url = URL("https://static.developer.riotgames.com/docs/lol/queues.json")
    with(url.openConnection() as HttpURLConnection) {
      requestMethod = "GET"
      if (responseCode == HttpURLConnection.HTTP_OK) {
        val jsonArr = JsonParser.parseString(inputStream.bufferedReader().readText()).asJsonArray
        for (json in jsonArr) {
          val obj = json.asJsonObject
          val queueId = obj.get("queueId").asInt
          if (queueId in 400..450) {
            var description = obj.get("description").asString.replace(" games", "")
            description = description.replace("5v5 ", "")
            map[queueId] = description
          }
        }
      }
    }
  }

}
