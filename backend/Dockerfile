# read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
# you will also find guides on how best to write your Dockerfile

FROM python:3.10

RUN useradd -m -u 1000 user

WORKDIR /app

# Create the models directory explicitly
RUN mkdir -p /app/models

# Create the uploads directory explicitly
RUN mkdir -p /app/uploads && chmod -R 755 /app/uploads && chown -R user:user /app/uploads

# Install curl or wget (depending on your preference for downloading files)
RUN apt-get update && apt-get install -y curl

# Download the files and save them inside the models folder
RUN curl -L -o /app/models/16k_data_cnn_feature_asins.npy "https://download.wetransfer.com/eugv/1386c21adaf30161e748d54eaa842df320250119195013/3c7223ba34250dd5427f6b5e62fbab7bf35e959d/16k_data_cnn_feature_asins.npy?cf=y&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRlZmF1bHQifQ.eyJleHAiOjE3MzczNzkxMDIsImlhdCI6MTczNzM3ODUwMiwiZG93bmxvYWRfaWQiOiJjNzJkNDNkZS0yY2I3LTQ1NTEtOTY2YS1kZjI2MTI0YjIzYjYiLCJzdG9yYWdlX3NlcnZpY2UiOiJzdG9ybSJ9.xQKuPBs7J2aBGZrh5e5f9S3yobD2ojw5-CFEMVgA5E8"

RUN curl -L -o /app/models/16k_data_cnn_features.npy "https://download.wetransfer.com/eugv/1386c21adaf30161e748d54eaa842df320250119195013/0c9616d0f30a8ce77a1a67293af435d8f13ca1c6/16k_data_cnn_features.npy?cf=y&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRlZmF1bHQifQ.eyJleHAiOjE3MzczNzkxMzgsImlhdCI6MTczNzM3ODUzOCwiZG93bmxvYWRfaWQiOiIzMGM4ZDQ1Ni1mMTkxLTRmNzYtYTk3Yi1kMWMzOTMxODc0MDEiLCJzdG9yYWdlX3NlcnZpY2UiOiJzdG9ybSJ9.5QszbPHgW87uqdWJO8oBeCW-HBI9pe6-yt4CZBFcLRY"


COPY --chown=user ./requirements.txt requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY --chown=user . /app

# Run the application as 'user'
USER user

CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "7860"]
