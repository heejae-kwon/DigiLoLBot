package DigiLoLAPI.common

import com.google.gson.Gson
import com.google.gson.JsonParser
import java.net.HttpURLConnection
import java.net.URL

object LeagueEntry {
  data class LeagueEntryDTO(
          val leagueId: String = "",
          val summonerId: String = "",
          val summonerName: String = "",
          val queueType: String = "",
          val tier: String = "",
          val rank: String = "",
          val leaguePoints: Int = 0,
          val wins: Int = 0,
          val losses: Int = 0,
          val hotStreak: Boolean = false,
          val veteran: Boolean = false,
          val freshBlood: Boolean = false,
          val inactive: Boolean = false,
          val miniSeries: MiniSeriesDTO = MiniSeriesDTO()
  )

  data class MiniSeriesDTO(
          val losses: Int = 0,
          val progress: String = "",
          val target: Int = 0,
          val wins: Int = 0
  )

  fun getLeagueEntries(encryptedSummonerId: String, apikey: String): List<LeagueEntryDTO> {
    val gson = Gson()
    val url = URL("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/$encryptedSummonerId?api_key=$apikey")
    val entries = mutableListOf<LeagueEntryDTO>()
    with(url.openConnection() as HttpURLConnection) {
      requestMethod = "GET"
      if (responseCode == HttpURLConnection.HTTP_OK) {
        val res = JsonParser.parseString(inputStream.bufferedReader().readText()).asJsonArray
        res.forEach { entry ->
          run {
            entries.add(gson.fromJson(entry.asJsonObject.toString(), LeagueEntryDTO::class.java))
          }
        }
      }
    }
    return entries
  }
}