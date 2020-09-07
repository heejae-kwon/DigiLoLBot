package com.hjkwon93.digiLoLAPI

import com.google.gson.Gson
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.HttpURLConnection
import java.net.URL




@RestController
@RequestMapping("/api")
class AppController {

    @GetMapping("")
    fun index() : String {
        return "API is working"
    }
}