package com.hjkwon93.digiLoLAPI.common

import com.google.gson.Gson
import java.net.HttpURLConnection
import java.net.URL

object Summoner {

  data class SummonerDTO(
          val accountId:	String = "",
          val profileIconId:	Int = 0,
          val revisionDate:	Long = 0,
          val name:	String = "",
          val id:	String = "",
          val puuid:	String = "",
          val summonerLevel: Long = 0
  )

  fun getSummoner(summonerName: String, apikey: String): SummonerDTO? {
    val gson = Gson()
    val url = URL("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/$summonerName?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection){
      requestMethod = "GET"
      if(responseCode == HttpURLConnection.HTTP_OK) {
        return gson.fromJson(inputStream.bufferedReader().readText(), SummonerDTO::class.java)
      }
    }
    return null
  }

}