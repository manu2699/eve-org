release: python manage.py migrate --run-syncdb
web: daphne Eveorg.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker -v2