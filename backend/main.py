from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from anthropic import Anthropic  
from dotenv import load_dotenv

load_dotenv()

# Global property cache to store real data
PROPERTY_CACHE = {}

def cache_properties(properties):
    """Store properties in cache for message generation"""
    global PROPERTY_CACHE
    for prop in properties:
        PROPERTY_CACHE[prop['id']] = prop

def get_cached_property(property_id):
    """Get property from cache or mock data"""
    # First try cache (real data)
    if property_id in PROPERTY_CACHE:
        return PROPERTY_CACHE[property_id]
    
    # Then try mock data
    return next((p for p in MOCK_PROPERTIES if p["id"] == property_id), None)

app = FastAPI(title="Wholesaler AI API", version="1.0.0")

# Enable CORS for React frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For local development
        "https://*.vercel.app",   # For Vercel deployment
        "https://*.netlify.app",  # For Netlify deployment
        "https://*.up.railway.app" # For Railway deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Claude client
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Pydantic models
class Property(BaseModel):
    id: int
    address: str
    zip_code: str
    city: str
    state: str
    property_type: str
    owner_name: str
    situation_type: str
    equity_percentage: float
    estimated_value: int
    liens_amount: int
    days_in_situation: int
    motivation_score: int
    last_updated: str

class PropertyFilter(BaseModel):
    zip_code: Optional[str] = None
    situation_types: Optional[List[str]] = None
    min_equity: Optional[float] = None
    max_equity: Optional[float] = None
    min_value: Optional[int] = None
    max_value: Optional[int] = None
    min_motivation: Optional[int] = None

class MessageRequest(BaseModel):
    property_id: int
    message_type: str = "initial_contact"

# Mock property data
MOCK_PROPERTIES = [
    {
        "id": 1,
        "address": "123 Oak Street",
        "zip_code": "10001",
        "city": "New York",
        "state": "NY",
        "property_type": "single_family",
        "owner_name": "John Smith",
        "situation_type": "pre_foreclosure",
        "equity_percentage": 0.25,
        "estimated_value": 450000,
        "liens_amount": 15000,
        "days_in_situation": 45,
        "motivation_score": 8,
        "last_updated": "2025-09-01",
        "data_source": "Mock Data"
    },
    {
        "id": 2,
        "address": "456 Pine Avenue",
        "zip_code": "10001",
        "city": "New York",
        "state": "NY",
        "property_type": "single_family",
        "owner_name": "Maria Rodriguez",
        "situation_type": "probate",
        "equity_percentage": 0.80,
        "estimated_value": 320000,
        "liens_amount": 5000,
        "days_in_situation": 120,
        "motivation_score": 7,
        "last_updated": "2025-08-15",
        "data_source": "Mock Data"
    },
    {
        "id": 3,
        "address": "789 Elm Drive",
        "zip_code": "10002",
        "city": "New York",
        "state": "NY",
        "property_type": "condo",
        "owner_name": "Robert Johnson",
        "situation_type": "distressed_property",
        "equity_percentage": 0.15,
        "estimated_value": 280000,
        "liens_amount": 25000,
        "days_in_situation": 180,
        "motivation_score": 9,
        "last_updated": "2025-08-01",
        "data_source": "Mock Data"
    },
    {
        "id": 4,
        "address": "321 Maple Court",
        "zip_code": "10001",
        "city": "New York",
        "state": "NY",
        "property_type": "multi_family",
        "owner_name": "Sarah Wilson",
        "situation_type": "tired_landlord",
        "equity_percentage": 0.60,
        "estimated_value": 680000,
        "liens_amount": 0,
        "days_in_situation": 365,
        "motivation_score": 6,
        "last_updated": "2025-07-20",
        "data_source": "Mock Data"
    },
    {
        "id": 5,
        "address": "654 Cedar Lane",
        "zip_code": "10003",
        "city": "New York",
        "state": "NY",
        "property_type": "single_family",
        "owner_name": "Michael Brown",
        "situation_type": "tax_delinquent",
        "equity_percentage": 0.45,
        "estimated_value": 390000,
        "liens_amount": 45000,
        "days_in_situation": 90,
        "motivation_score": 8,
        "last_updated": "2025-08-30",
        "data_source": "Mock Data"
    },
    {
        "id": 6,
        "address": "987 Birch Street",
        "zip_code": "10002",
        "city": "New York",
        "state": "NY",
        "property_type": "townhouse",
        "owner_name": "Lisa Davis",
        "situation_type": "foreclosure_auction",
        "equity_percentage": 0.10,
        "estimated_value": 520000,
        "liens_amount": 65000,
        "days_in_situation": 30,
        "motivation_score": 10,
        "last_updated": "2025-09-02",
        "data_source": "Mock Data"
    }
]

@app.get("/")
async def root():
    return {"message": "Wholesaler AI API is running"}

@app.post("/api/properties/search")
async def search_properties(filters: PropertyFilter) -> List[Property]:
    """Search properties based on filters - supports both real and mock data"""
    
    # Check if this is an Atlanta-area zip code
    atlanta_zip_codes = ["30309", "30308", "30305", "30312", "30313", "30314", "30315", "30316", "30317"]
    
    if filters.zip_code and filters.zip_code in atlanta_zip_codes:
        try:
            # Import the service here to avoid import issues
            from fulton_county_service import get_fulton_county_properties
            
            # Fetch real Fulton County data
            properties = await get_fulton_county_properties(filters.zip_code)
            
            if properties:
                # Apply additional filters to real data
                if filters.situation_types:
                    properties = [p for p in properties if p["situation_type"] in filters.situation_types]
                
                if filters.min_equity is not None:
                    properties = [p for p in properties if p["equity_percentage"] >= filters.min_equity]
                    
                if filters.max_equity is not None:
                    properties = [p for p in properties if p["equity_percentage"] <= filters.max_equity]
                
                if filters.min_value is not None:
                    properties = [p for p in properties if p["estimated_value"] >= filters.min_value]
                    
                if filters.max_value is not None:
                    properties = [p for p in properties if p["estimated_value"] <= filters.max_value]
                
                if filters.min_motivation is not None:
                    properties = [p for p in properties if p["motivation_score"] >= filters.min_motivation]
                
                # Sort by motivation score (highest first)
                properties.sort(key=lambda x: x["motivation_score"], reverse=True)
                
                # Cache the properties for message generation
                cache_properties(properties)
                return properties
            
        except Exception as e:
            print(f"Error fetching real data, falling back to mock: {e}")
    
    # Fallback to mock data for non-Atlanta zip codes or errors
    properties = MOCK_PROPERTIES.copy()
    
    # Apply filters to mock data
    if filters.zip_code:
        properties = [p for p in properties if p["zip_code"] == filters.zip_code]
    
    if filters.situation_types:
        properties = [p for p in properties if p["situation_type"] in filters.situation_types]
    
    if filters.min_equity is not None:
        properties = [p for p in properties if p["equity_percentage"] >= filters.min_equity]
        
    if filters.max_equity is not None:
        properties = [p for p in properties if p["equity_percentage"] <= filters.max_equity]
    
    if filters.min_value is not None:
        properties = [p for p in properties if p["estimated_value"] >= filters.min_value]
        
    if filters.max_value is not None:
        properties = [p for p in properties if p["estimated_value"] <= filters.max_value]
    
    if filters.min_motivation is not None:
        properties = [p for p in properties if p["motivation_score"] >= filters.min_motivation]
    
    # Sort by motivation score (highest first)
    properties.sort(key=lambda x: x["motivation_score"], reverse=True)
    
    # Cache the mock properties too
    cache_properties(properties)
    return properties

@app.get("/api/properties/{property_id}")
async def get_property(property_id: int) -> Property:
    """Get a specific property by ID"""
    property_data = get_cached_property(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data

@app.post("/api/generate-message")
async def generate_message(request: MessageRequest):
    """Generate AI-powered initial contact message"""
    # Get property data from cache or mock data
    property_data = get_cached_property(request.property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Message templates based on situation type
    situation_contexts = {
        "pre_foreclosure": {
            "context": "homeowner facing foreclosure",
            "pain_points": "avoiding foreclosure, saving credit, getting cash to move",
            "approach": "helpful and understanding, offering a quick solution"
        },
        "probate": {
            "context": "heir dealing with inherited property", 
            "pain_points": "quick liquidation, avoiding probate delays, splitting proceeds",
            "approach": "respectful and efficient, understanding family situation"
        },
        "distressed_property": {
            "context": "owner of property in poor condition",
            "pain_points": "avoiding repair costs, quick sale, eliminating ongoing expenses", 
            "approach": "solution-focused, emphasizing as-is purchase"
        },
        "tired_landlord": {
            "context": "landlord tired of managing rental property",
            "pain_points": "tenant issues, maintenance costs, management headaches",
            "approach": "understanding their frustration, offering clean exit"
        },
        "tax_delinquent": {
            "context": "homeowner behind on property taxes",
            "pain_points": "avoiding tax sale, protecting remaining equity",
            "approach": "urgent but helpful, time-sensitive solution"
        },
        "foreclosure_auction": {
            "context": "homeowner with property going to auction soon",
            "pain_points": "very time sensitive, saving any remaining equity", 
            "approach": "urgent but respectful, immediate action needed"
        }
    }
    
    situation = situation_contexts.get(property_data["situation_type"], situation_contexts["distressed_property"])
    
    # Create AI prompt
    prompt = f"""
    You are a professional real estate wholesaler writing a respectful, helpful initial contact message.
    
    Property Details:
    - Owner: {property_data["owner_name"]}
    - Address: {property_data["address"]}, {property_data["city"]}, {property_data["state"]}
    - Situation: {property_data["situation_type"].replace('_', ' ').title()}
    - Property Value: ${property_data["estimated_value"]:,}
    - Days in situation: {property_data["days_in_situation"]}
    
    Context: This is a {situation["context"]}
    Their pain points: {situation["pain_points"]}
    Approach: Be {situation["approach"]}
    
    Write a professional, empathetic initial text message (160 characters max) that:
    1. Introduces yourself briefly
    2. Shows you understand their situation  
    3. Offers a solution
    4. Asks for permission to discuss further
    5. Is compliant and not pushy
    
    Do not use high-pressure language or make unrealistic promises.
    """
    
    try:
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=200,
            temperature=0.7,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        message = response.content[0].text.strip()
        
        return {
            "property_id": request.property_id,
            "generated_message": message,
            "situation_type": property_data["situation_type"],
            "owner_name": property_data["owner_name"],
            "estimated_response_rate": situation["approach"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate message: {str(e)}")

@app.get("/api/situation-types")
async def get_situation_types():
    """Get all available situation types for filtering"""
    return {
        "situation_types": [
            {"value": "pre_foreclosure", "label": "Pre-Foreclosure", "description": "Behind on mortgage payments"},
            {"value": "foreclosure_auction", "label": "Foreclosure/Auction", "description": "Going to auction"}, 
            {"value": "probate", "label": "Probate", "description": "Inherited property"},
            {"value": "distressed_property", "label": "Distressed Property", "description": "Poor condition"},
            {"value": "tired_landlord", "label": "Tired Landlord", "description": "Want to exit rental business"},
            {"value": "tax_delinquent", "label": "Tax Delinquent", "description": "Behind on property taxes"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)