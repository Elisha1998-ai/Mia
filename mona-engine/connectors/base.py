from abc import ABC, abstractmethod
from typing import List, Dict

class BaseConnector(ABC):
    """
    Abstract Base Class for all store connectors.
    Ensures a consistent interface for Mia's brain.
    """
    
    @abstractmethod
    def fetch_products(self) -> List[Dict]:
        """
        Fetches products from the external platform.
        Should return a list of dictionaries in Mia's Standard Product format.
        """
        pass

    @abstractmethod
    def fetch_orders(self) -> List[Dict]:
        """
        Fetches orders from the external platform.
        Should return a list of dictionaries in Mia's Standard Order format.
        """
        pass

    @abstractmethod
    def get_platform_name(self) -> str:
        """Returns the name of the platform (e.g., 'shopify', 'amazon')"""
        pass
