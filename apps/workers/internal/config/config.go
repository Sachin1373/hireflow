package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type SMTP struct {
	SMTP_HOST string
	SMTP_USER string
	SMTP_PASS string
	SMTP_PORT string
}

type Config struct {
	SMTP
	CLIENT_URL   string
	DATABASE_URL string
}

func Load() (*Config, error) {
	_ = godotenv.Load("../../.env")
	cfg := &Config{}

	cfg.SMTP.SMTP_HOST = os.Getenv("SMTP_HOST")
	cfg.SMTP.SMTP_USER = os.Getenv("SMTP_USER")
	cfg.SMTP.SMTP_PASS = os.Getenv("SMTP_PASS")
	cfg.SMTP.SMTP_PORT = os.Getenv("SMTP_PORT")
	cfg.CLIENT_URL = os.Getenv("CLIENT_URL")
	cfg.DATABASE_URL = os.Getenv("DATABASE_URL")

	// Validation
	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil

}

func (c *Config) validate() error {
	if c.SMTP.SMTP_HOST == "" {
		return errors.New("SMTP_HOST is required")
	}

	if c.SMTP.SMTP_USER == "" {
		return errors.New("SMTP_USER is required")
	}

	if c.SMTP.SMTP_PASS == "" {
		return errors.New("SMTP_PASS is required")
	}

	if c.SMTP.SMTP_PORT == "" {
		return errors.New("SMTP_PORT is required")
	}

	if c.CLIENT_URL == "" {
		return errors.New("ClientUrl is required")
	}

	if c.DATABASE_URL == "" {
		return errors.New("DataBase url required")
	}

	return nil
}
