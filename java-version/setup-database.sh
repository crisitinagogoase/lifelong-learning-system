#!/bin/bash

# Script pentru setup baza de date PostgreSQL
# Folosește: ./setup-database.sh

# Adaugă PostgreSQL la PATH
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

echo "🔍 Verificare PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL nu este în PATH!"
    echo "Adaugă manual la ~/.zshrc:"
    echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"'
    exit 1
fi

echo "✅ PostgreSQL găsit: $(psql --version)"

echo ""
echo "📦 Creare baza de date..."
createdb learning_system 2>/dev/null || echo "⚠️  Baza de date 'learning_system' există deja sau eroare"

echo ""
echo "📝 Rulare schema.sql..."
psql -d learning_system -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema creată cu succes!"
else
    echo "❌ Eroare la crearea schemei"
    exit 1
fi

echo ""
echo "📊 Adăugare date inițiale..."
psql -d learning_system -f database/initial-data.sql

if [ $? -eq 0 ]; then
    echo "✅ Date inițiale adăugate cu succes!"
else
    echo "❌ Eroare la adăugarea datelor inițiale"
    exit 1
fi

echo ""
echo "🔍 Verificare..."
COURSE_COUNT=$(psql -d learning_system -t -c "SELECT COUNT(*) FROM courses;")
echo "📚 Cursuri în baza de date: $COURSE_COUNT"

echo ""
echo "✅ Setup complet! Baza de date este gata de folosit."
