package com.hjkwon93.digiLoLAPI.controller

import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
          val bot  :Boolean,  //Flag indicating whether or not this participant is a bot
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

}
