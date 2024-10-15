FROM python:3.12-slim

WORKDIR /app

RUN apt-get update \
&& apt-get install -y libgl1-mesa-glx \
&& apt-get clean

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["python", "main.py"]
