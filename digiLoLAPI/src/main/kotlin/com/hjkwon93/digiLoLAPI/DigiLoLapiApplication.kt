package com.hjkwon93.digiLoLAPI

import com.hjkwon93.digiLoLAPI.common.ChampionIdMap
import com.hjkwon93.digiLoLAPI.common.QueueType
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DigiLoLapiApplication

fun main(args: Array<String>) {
    print(ChampionIdMap)
  print(QueueType)
	runApplication<DigiLoLapiApplication>(*args)
}
