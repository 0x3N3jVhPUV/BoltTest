#!/bin/bash

# Démarrer le backend
(
  cd backend
  node server.js
) &

# Démarrer le frontend
(
  cd frontend
  npm run dev
) 