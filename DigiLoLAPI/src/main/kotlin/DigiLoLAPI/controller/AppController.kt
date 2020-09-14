package DigiLoLAPI.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api")
class AppController {

    @GetMapping("")
    fun index() : String {
        return "API is working"
    }
}