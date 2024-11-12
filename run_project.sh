#!/bin/bash

# Vérification que le script est lancé depuis la racine du projet
if [ ! -d "Client" ] || [ ! -d "Serveur" ]; then
  echo "Veuillez exécuter ce script depuis la racine du projet."
  exit 1
fi

# Fonction pour exécuter le front-end
start_frontend() {
  echo "Démarrage du front-end..."
  cd Client/frontend/
  npm install
  npm run build &
  cd ../../
}

# Fonction pour exécuter le back-end
start_backend() {
  echo "Démarrage du back-end..."
  cd Client/backend/
  npm install
  node server.js &
  cd ../../
}

# Fonction pour installer les dépendances Python
install_python_dependencies() {
  echo "Installation des dépendances Python..."
  cd Serveur/
  pip install -r requirements.txt
  cd ../
}

# Fonction pour vérifier les variables d'environnement indispensables
check_env_variables() {
  if [ ! -f "Serveur/.env" ]; then
    echo "Le fichier .env est manquant dans le répertoire Serveur."
    echo "Veuillez créer ce fichier avec les variables d'environnement indispensables avant de continuer."
    exit 1
  fi
}

# Fonction pour exécuter run_scraper.py
start_scraper() {
  echo "Démarrage du scraper..."
  cd Serveur/Front/
  python run_scraper.py &
  cd ../../
}

# Exécution des fonctions
check_env_variables
install_python_dependencies
start_frontend
start_backend
start_scraper

echo "Tous les services ont été démarrés."


# Pour exécuter le script, veuillez suivre les étapes suivantes :
#   chmod +x run_project.sh
#    ./run_project.sh
