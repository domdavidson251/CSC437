import "./views/league-page";
import "./views/mlb-page";
import "./views/nba-page";
import "./views/nfl-page";
import "./views/mlb-team-page";
import "./views/mlb-game-page";
import "./views/nba-game-page";
import "./views/nba-team-page";
import "./views/nfl-team-page";
import "./views/nfl-game-page";

export default [
  {path: "/app/nfl/games/:gameid", component: "nfl-game-page"},
  {path: "/app/nfl/teams/:teamid", component: "nfl-team-page"},
  {path: "/app/nba/teams/:teamid", component: "nba-team-page"},
  {path: "/app/nba/games/:gameid", component: "nba-game-page"},
  {path: "/app/mlb/games/:gameid", component: "mlb-game-page"},
  {path: "/app/mlb/teams/:teamid", component: "mlb-team-page"},
  {path: "/app/mlb", component: "mlb-page"},
  {path: "/app/nba", component: "nba-page"},
  {path: "/app/nfl", component: "nfl-page"},
  { path: "/app", component: "league-page" },
  { path: "(.*)", redirect: "/app" }
];