import controllers

from fastapi import FastAPI
from fastapi_router_controller import Controller, ControllersTags

from utils.config import Config
from utils.middleware import LogIncomingRequest
from utils.middleware.request_cancellation import RequestCancellation

#########################################
#### Configure the main application #####
#########################################
app = FastAPI(
    title='{}'.format(Config.read('app', 'name')),
    openapi_tags=ControllersTags)

app.add_middleware(LogIncomingRequest)
app.add_middleware(RequestCancellation)

for router in Controller.routers():
    app.include_router(router)