package com.hjkwon93.digiLoLAPI.controller

import com.hjkwon93.digiLoLAPI.common.LeagueEntry
import com.hjkwon93.digiLoLAPI.common.Summoner
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/search-summoner")
class SearchSummonerByNameController {
  @Value("\${apikey}")
   private lateinit var apikey : String

  @GetMapping("")
  fun index(@RequestParam(value = "summonerName", required = true) summonerName: String) : String {
    val lolId =  summonerName.replace(" ","%20")
    val summoner = Summoner.getSummoner(lolId, apikey)
    var leagueEntries : List<LeagueEntry.LeagueEntryDTO>?
    if (summoner != null) {
      leagueEntries = LeagueEntry.getLeagueEntries(summoner.id, apikey)
      return leagueEntries.toString()
    }
    return "Fail to search summoner name"
  }
}