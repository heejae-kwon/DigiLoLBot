# DigiLoLBot Deno Server
> This project includes deno server which is a part of [DigiLoLBot](https://github.com/heejae-kwon/DigiLoLBot)

## Preparation
* [Deno](https://deno.land/)
* [Riot Development Api Key](https://developer.riotgames.com/docs/portal)
* [VSCode](https://code.visualstudio.com/) (for development)

## Run
1. Create ```config.ts``` file with following the ```config_form.ts```
2. Then fill apikey property with Riot Development Api Key and set the port number.
3. Run :
```sh
deno run --allow-net ./index.ts
```


## List of API call
#### 1. Champion Rotations
  Returns json data about champion rotations.

* **URL**
  /api/champion-rotations

* **Method:**
  `GET`
  
*  **URL Params**
   * **Required:**
      None

* **Data Params**
  None

* **Success Response:**
  * **Code:** 200 
  * **Content:** `ChampionRotationsData`(application/json)
 ```typescript
 interface ChampionRotationsData { 
   // List of champion's name
   championRotations: string[];
 }
 ```
* **Error Response:**
  * **Code:** 404 NOT FOUND
  * **Content:** `ErrorResponse`(application/json)
```typescript
interface ErrorResponse {
  error: "Fail getting champion rotations",
  // Response json data from Riot api server
  api: JSON;
}
```

#### 2. Service Status
  Returns json data about service status.

* **URL**
  /api/service-status

* **Method:**
  `GET`
  
*  **URL Params**
   * **Required:**
      None

* **Data Params**
  None

* **Success Response:**
  * **Code:** 200 
  * **Content:** `ServiceStatusData`(application/json)
```typescript
interface ServiceStatusData {
  // List of ServiceData
  services: ServiceData[];
}
interface ServiceData {
  //Service name
  name: string;
  //Service status
  status: string;
  messages: string[];
}
```
* **Error Response:**
  * **Code:** 404 NOT FOUND
  * **Content:** `ErrorResponse`(application/json)
```typescript
interface ErrorResponse {
  error: "Fail getting service status",
  // Response json data from Riot api server
  api: JSON;
}
```
#### 3. Matches
  Returns json data about summoner matches.

* **URL**
  /api/matches?summonerName=

* **Method:**
  `GET`
  
*  **URL Params**
   * **Required:**
    `summonerName=[string]`

* **Data Params**
  None

* **Success Response:**
  * **Code:** 200 
  * **Content:** `MatchesData`(application/json)
```typescript
interface MatchesData {
  // URL of summoner icon
  icon: string;
  // Summoner name
  name: string;
  wins: number;
  loses: number;
  // List of MatchData
  matches: MatchData[];
}
interface MatchData {
  // Champion name
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  // Result of game.
  win: boolean;
  // Type of game. Only supports Ranked Flex, Solo, ARAM
  queueType: string;
}
```
* **Error Response:**
  * **Code:** 404 NOT FOUND
  * **Content:** `ErrorResponse`(application/json)
```typescript
interface ErrorResponse {
  // Error message
  error: string;
  // Response json data from Riot api server
  api: JSON;
}
```
#### 4. Search Summoner
  Returns json data about summoner information.

* **URL**
  /api/search-summoner?summonerName=

* **Method:**
  `GET`
  
*  **URL Params**
   * **Required:**
    `summonerName=[string]`

* **Data Params**
  None

* **Success Response:**
  * **Code:** 200 
  * **Content:** `SearchSummonerData`(application/json)
```typescript
interface SearchSummonerData {
  // URL of icon
  icon: string;
  name: string;
  // Summoner level
  level: number;
  // Name of best champion
  bestChampion: string;
  // List of LeagueEntryData
  leagueEntries: LeagueEntryData[];
}
interface LeagueEntryData {
  // Type of summoner tier
  tier: string;
  // Roman number of summoner rank
  rank: string;
  // LP points
  leaguePoints: number;
  wins: number;
  loses: number;
  // Only supports Solo and Flex game
  queueType: "Ranked Solo" | "Ranked Flex" | string;
}
```
* **Error Response:**
  * **Code:** 404 NOT FOUND
  * **Content:** `ErrorResponse`(application/json)
```typescript
interface ErrorResponse {
  // Error message
  error: string;
  // Response json data from Riot api server
  api: JSON;
}
```

#### 5. Spectator
  Returns json data about spectating data.

* **URL**
  /api/spectator?summonerName=

* **Method:**
  `GET`
  
*  **URL Params**
   * **Required:**
    `summonerName=[string]`

* **Data Params**
  None

* **Success Response:**
  * **Code:** 200 
  * **Content:** `SpectatorData`(application/json)
```typescript
interface SpectatorData {
  teams: TeamData[];
  gameStartTime: number;
  gameLength: number;
  // Only supports Ranked Flex and Solo
  queueType: string;
}
interface ParticipantsData {
  championName: string;
  summonerName: string;
  tier: string;
  rank: string;
}
interface TeamData {
  teamName: "red" | "blue" | string;
  participants: ParticipantsData[];
  bannedChampions: string[];
}
```
* **Error Response:**
  * **Code:** 404 NOT FOUND
  * **Content:** `ErrorResponse`(application/json)
```typescript
interface ErrorResponse {
  // Error message
  error: string;
  // Response json data from Riot api server
  api: JSON;
}
```


## Updates

* 1.0.0
    * First launch


<!-- Markdown link & img dfn's -->
