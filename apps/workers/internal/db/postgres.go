package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {

	connStr := os.Getenv("DATABASE_URL")

	database, err := sql.Open("postgres", connStr)

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
