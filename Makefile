container:
    docker build -t smartspender .
    docker run -p 4000:5050 smartspender