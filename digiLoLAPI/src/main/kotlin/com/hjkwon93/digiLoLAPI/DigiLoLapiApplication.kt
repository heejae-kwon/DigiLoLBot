package com.hjkwon93.digiLoLAPI

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DigiLoLapiApplication

fun main(args: Array<String>) {
    print(ChampionMap)
	runApplication<DigiLoLapiApplication>(*args)
}
