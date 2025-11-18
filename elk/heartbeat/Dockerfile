FROM docker.elastic.co/beats/heartbeat:8.13.0
USER root
COPY heartbeat.yml /usr/share/heartbeat/heartbeat.yml
RUN chmod go-w /usr/share/heartbeat/heartbeat.yml
