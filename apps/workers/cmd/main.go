package main

import (
	"log"
	"time"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"github.com/Sachin1373/hireflow/worker/internal/db"
	"github.com/Sachin1373/hireflow/worker/internal/jobs"
)

func main() {
	cfg, err := config.Load()

	if err != nil {
		panic("failed to load config: " + err.Error())
	}

	db.Connect(cfg)

	log.Println("Worker started")

	for {
		err := jobs.ProcessExpiredJobs(cfg)

		if err != nil {
			log.Println(err)
		}

		time.Sleep(1 * time.Minute)
	}
}
