package com.hjkwon93.digiLoLAPI.controller

import com.google.gson.Gson
import com.google.gson.JsonObject
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.HttpURLConnection
import java.net.URL


@RestController
@RequestMapping("/api/server-status")
class ServerStatusController {
  @Value("\${apikey}")
 private lateinit var apikey : String

  data class SharedStatus(
          val locales:	List<String>,
  val hostname:	String,
  val name	:String,
  val services:	List<Service>,
  val slug:	String,
  val region_tag:	String
  )

  data class Service(
          val incidents: List<Incident>,
          val name : String,
          val slug : String,
          val status: String
  )

  data class Incident(
          val active : Boolean,
          val created_at: String,
          val id: String,
          val updates: List<Message>
  )

  data class Message (
          val severity :String,
          val updated_at: String,
          val author:	String,
          val translations:	List<Translation>,
          val created_at:	String,
          val id:	String,
          val content:	String
  )
  data class Translation(
          val updated_at : String,
          val locale: String,
          val content : String
  )

  @GetMapping("")
  fun index() : String {
    val gson = Gson()
    var jsonString: String
    val url = URL("https://kr.api.riotgames.com/lol/status/v3/shard-data?api_key=$apikey")
    with(url.openConnection() as HttpURLConnection){
      requestMethod = "GET"
      if(responseCode != HttpURLConnection.HTTP_OK) {
        return "{error: \"Fail getting server status\"}"
      }
      jsonString = inputStream.bufferedReader().readText()
    }
    val returnObj = JsonObject()

    val sharedStatus = gson.fromJson(jsonString, SharedStatus::class.java)
    val services = sharedStatus.services
    services.forEach{service->
      run {
       val statusMessage = mutableListOf<String>()
        service.incidents.forEach{incident->
          run{
            statusMessage.add(incident.updates.first().content)
         }
        }
        val jo = JsonObject()
        jo.add("status", gson.toJsonTree(service.status))
        jo.add("messages", gson.toJsonTree(statusMessage))
        returnObj.add(service.name, gson.toJsonTree(jo))
      }
    }

    return returnObj.toString()
  }
}
