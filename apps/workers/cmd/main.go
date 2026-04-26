package main

import (
	"log"

	"github.com/Sachin1373/hireflow/worker/internal/db"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading root .env")
	}

	db.Connect()

	log.Println("Worker started")
}
