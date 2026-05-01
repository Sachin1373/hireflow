package db

import (
	"database/sql"
	"log"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect(cfg *config.Config) {

	database, err := sql.Open("postgres", cfg.DATABASE_URL)

	if err != nil {
		log.Fatal(err)
	}

	err = database.Ping()

	if err != nil {
		log.Fatal(err)
	}

	DB = database

	log.Println("Database connected")
}
