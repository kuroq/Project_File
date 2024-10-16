from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from databases import Database
from datetime import datetime
import pytz
from sqlalchemy import create_engine, MetaData, Table, select, update, Column, String, Integer, Boolean, DateTime, Numeric, func
from sqlalchemy.sql import and_
import decimal
import logging


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


# 데이터베이스 접속 URL 설정
DATABASE_URL1 = "mysql://セキュリティのために削除しました。/boardDB1_ksr6"
DATABASE_URL2 = "mysql://セキュリティのために削除しました。/boardDB2_ksr6"
DATABASE_URL3 = "mysql://セキュリティのために削除しました。/boardDB3_ksr6"

# 데이터베이스 연결 생성
database1 = Database(DATABASE_URL1)
database2 = Database(DATABASE_URL2)
database3 = Database(DATABASE_URL3)

# SQLAlchemy 엔진 및 메타데이터 설정
engine1 = create_engine(DATABASE_URL1)
engine2 = create_engine(DATABASE_URL2)
engine3 = create_engine(DATABASE_URL3)
metadata = MetaData()
metadata.bind = engine1

# FastAPI 애플리케이션이 시작될 때 데이터베이스 연결
@app.on_event("startup")
async def startup():
    await database1.connect()
    await database2.connect()
    await database3.connect()

# FastAPI 애플리케이션이 종료될 때 데이터베이스 연결 해제
@app.on_event("shutdown")
async def shutdown():
    await database1.disconnect()
    await database2.disconnect()
    await database3.disconnect()

# 일본 현지 시간 함수
def get_japan_time():
    japan_tz = pytz.timezone('Asia/Tokyo')
    return datetime.now(japan_tz)

# datetime 포맷 함수
def format_datetime(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S') if dt else None

# 데이터 모델 정의
class CreateData(BaseModel):
    purposeIdx: str
    message: str
    mean: decimal.Decimal
    meanAddPhrase: decimal.Decimal
    meanAddMor: decimal.Decimal
    meanAddAll: decimal.Decimal
    runningTime: str
    createdDate: datetime = Field(default_factory=lambda: get_japan_time())
    sendDate: datetime = None  # sendDate 필드 추가
    yesValue: decimal.Decimal
    noValue: decimal.Decimal
    confirmStatus: bool = False

class UpdateData(BaseModel):
    messageId: str
    sendDate: datetime

class AnswerData(BaseModel):
    answerId: str
    messageId: str
    answer: str
    mean: decimal.Decimal
    meanAddPhrase: decimal.Decimal
    meanAddMor: decimal.Decimal
    meanAddAll: decimal.Decimal
    sendDate: datetime
    receiveDate: datetime = None
    yesOrNo: bool


# 데이터 ID 생성 함수 수정
async def generate_new_id():
    # 직접 SQL 쿼리로 최대 ID 값 가져오기
    query = "SELECT messageId FROM firstmessages ORDER BY messageId DESC LIMIT 1;"
    result = await database1.fetch_one(query)
    
    if result ['messageId']:
        last_id = result['messageId']
        parts = last_id.split('-')
        if len(parts) == 3:
            new_id = f"{parts[0]}-{parts[1]}-{int(parts[2]) + 1}"
        else:
            raise HTTPException(status_code=500, detail="Invalid ID format in the database.")
    else:
        new_id = "2-6-1"
    
    return new_id


# boardDB1_ksr6의 firstmessages 테이블 데이터 조회 API
@app.get("/api/boardDB1/firstmessages")
async def get_first_messages_db1():
    query = """
    SELECT messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus, sendDate 
    FROM firstmessages
    """

    results = await database1.fetch_all(query=query)
    
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['createdDate'] = format_datetime(result_dict['createdDate'])
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

# boardDB1_ksr6의 answermessages 테이블 데이터 조회 API
@app.get("/api/boardDB1/answermessages")
async def get_answer_messages_db1():
    query = """
    SELECT answerId, messageId, answer, mean, meanAddPhrase, meanAddMor, meanAddAll, sendDate, receiveDate, yesOrNo 
    FROM answermessages
    """

    results = await database1.fetch_all(query=query)
    
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        result_dict['receiveDate'] = format_datetime(result_dict['receiveDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

# # boardDB1_ksr6의 firstmessages와 answermessages 테이블 데이터 조회 API
# @app.get("/api/boardDB1/messages", response_model=List[CreateData])
# async def get_first_and_answer_messages_db1():
#     query1 = "SELECT * FROM firstmessages"
#     query2 = "SELECT * FROM answermessages"

#     results1 = await database1.fetch_all(query=query1)
#     results2 = await database1.fetch_all(query=query2)
    
#     if not results1 and not results2:
#         raise HTTPException(status_code=404, detail="No data found")
    
#     return results1 + results2

# boardDB2_ksr6의 firstmessages 테이블 데이터 조회 API
@app.get("/api/boardDB2/firstmessages")
async def get_firstmessages_db2():
    query = """
    SELECT messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus, sendDate 
    FROM firstmessages
    """
    results = await database2.fetch_all(query=query)
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['createdDate'] = format_datetime(result_dict['createdDate'])
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

# boardDB3_ksr6의 firstmessages 테이블 데이터 조회 API
@app.get("/api/boardDB3/firstmessages")
async def get_firstmessages_db3():
    query = """
    SELECT messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus, sendDate 
    FROM firstmessages
    """
    results = await database3.fetch_all(query=query)
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['createdDate'] = format_datetime(result_dict['createdDate'])
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

logging.basicConfig(level=logging.INFO)

# boardDB1_ksr6의 firstmessages 테이블에 데이터 삽입 API 저장되는 곳이 DB 123 전부
@app.post("/boardDB/firstmessages")
async def create_firstmessage(data: CreateData):
    new_Id = await generate_new_id()  # 새로운 ID 생성
    japan_time = get_japan_time()     # 일본 현지 시간
    #  sendDate, :sendDate,
    query = """
    INSERT INTO firstmessages (messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus)
    VALUES (:messageId, :purposeIdx, :message, :mean, :meanAddPhrase, :meanAddMor, :meanAddAll, :runningTime, :createdDate, :yesValue, :noValue, :confirmStatus)
    """
    
    values = {
        "messageId": new_Id,
        "purposeIdx": data.purposeIdx,
        "message": data.message,
        "mean": float(data.mean),
        "meanAddPhrase": float(data.meanAddPhrase),
        "meanAddMor": float(data.meanAddMor),
        "meanAddAll": float(data.meanAddAll),
        "runningTime": data.runningTime,
        "createdDate": japan_time,
        # "sendDate": format_datetime(japan_time),
        "yesValue": float(data.yesValue),
        "noValue": float(data.noValue),
        "confirmStatus": data.confirmStatus
    }

    try:
        await database1.execute(query=query, values=values)
        await database2.execute(query=query, values=values)
        await database3.execute(query=query, values=values)
    except Exception as e:
        logging.error(f"Database insertion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"success": True, "message": "Data inserted successfully"}

# messageId 기준으로 sendDate 수정 API 저장 되는 곳이 DB 123 전부
@app.put("/boardDB1/firstmessages/{messageId}")
async def update_senddate(messageId: str):
    japan_time = get_japan_time()  # 일본 현지 시간
    
    firstmessages1 = Table('firstmessages', metadata, autoload_with=engine1)
    firstmessages2 = Table('firstmessages', metadata, autoload_with=engine2)
    firstmessages3 = Table('firstmessages', metadata, autoload_with=engine3)
    
    query1 = update(firstmessages1).where(firstmessages1.c.messageId == messageId).values(sendDate=japan_time)
    query2 = update(firstmessages2).where(firstmessages2.c.messageId == messageId).values(sendDate=japan_time)
    query3 = update(firstmessages3).where(firstmessages3.c.messageId == messageId).values(sendDate=japan_time)

    try:
        await database1.execute(query=query1)
        await database2.execute(query=query2)
        await database3.execute(query=query3)
        
        # 업데이트된 데이터를 다시 조회하여 반환
        # query = select([firstmessages1.c.sendDate]).where(firstmessages1.c.messageId == messageId)
        # result = await database1.fetch_one(query)
        
        # if result is None:
        #     raise HTTPException(status_code=404, detail="Message ID not found")
        
        # formatted_send_date = format_datetime(result['sendDate'])
        # formatted_send_date = format_datetime(result[firstmessages1.c.sendDate])
        # formatted_send_date = format_datetime(result[0])
    except Exception as e:
        logging.error(f"Database update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "success": True,
        "message": "sendDate updated successfully",
        "sendDate": format_datetime(japan_time)
    }

# FastAPI 애플리케이션 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5006)

