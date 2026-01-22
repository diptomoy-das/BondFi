import requests
import sys
import json
from datetime import datetime

class BondDAppAPITester:
    def __init__(self, base_url="https://fracbond.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_email = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {name}: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    details = f"Status: {response.status_code}"
                except:
                    response_data = {}
                    details = f"Status: {response.status_code} (No JSON response)"
            else:
                try:
                    error_data = response.json()
                    details = f"Expected {expected_status}, got {response.status_code}. Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details = f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:100]}"
                response_data = {}

            self.log_test(name, success, details)
            return success, response_data

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        self.user_email = f"test_user_{timestamp}@example.com"
        
        user_data = {
            "name": f"Test User {timestamp}",
            "email": self.user_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=user_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        if not self.user_email:
            self.log_test("User Login", False, "No user email available for login test")
            return False
            
        login_data = {
            "email": self.user_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_get_bonds(self):
        """Test getting all bonds"""
        success, response = self.run_test(
            "Get All Bonds",
            "GET",
            "bonds",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            self.log_test("Bond Data Validation", True, f"Found {len(response)} bonds")
            return response
        elif success:
            self.log_test("Bond Data Validation", False, "No bonds found in response")
        
        return []

    def test_get_single_bond(self, bond_id="bond_us_1"):
        """Test getting a single bond"""
        success, response = self.run_test(
            f"Get Single Bond ({bond_id})",
            "GET",
            f"bonds/{bond_id}",
            200
        )
        return success, response

    def test_portfolio_empty(self):
        """Test portfolio endpoint (should be empty initially)"""
        success, response = self.run_test(
            "Get Portfolio (Empty)",
            "GET",
            "portfolio",
            200
        )
        
        if success:
            expected_keys = ['total_value', 'total_tokens', 'holdings', 'earnings_history']
            has_all_keys = all(key in response for key in expected_keys)
            if has_all_keys:
                self.log_test("Portfolio Structure", True, "All required fields present")
            else:
                self.log_test("Portfolio Structure", False, f"Missing keys: {[k for k in expected_keys if k not in response]}")
        
        return success, response

    def test_wallet(self):
        """Test wallet endpoint"""
        success, response = self.run_test(
            "Get Wallet",
            "GET",
            "wallet",
            200
        )
        
        if success and 'usdc_balance' in response:
            balance = response['usdc_balance']
            self.log_test("Initial USDC Balance", True, f"Balance: ${balance}")
            return True, balance
        
        return False, 0

    def test_wallet_topup(self, amount=50.0):
        """Test wallet top-up"""
        success, response = self.run_test(
            "Wallet Top-up",
            "POST",
            f"wallet/topup?amount={amount}",
            200
        )
        
        if success and 'new_balance' in response:
            new_balance = response['new_balance']
            self.log_test("Top-up Balance Update", True, f"New balance: ${new_balance}")
            return True, new_balance
        
        return False, 0

    def test_buy_bond(self, bond_id="bond_us_1", amount=10.0):
        """Test buying a bond"""
        transaction_data = {
            "bond_id": bond_id,
            "amount": amount
        }
        
        success, response = self.run_test(
            f"Buy Bond ({bond_id})",
            "POST",
            "transactions/buy",
            200,
            data=transaction_data
        )
        
        if success:
            expected_keys = ['id', 'email', 'bond_id', 'amount', 'tokens_received', 'timestamp']
            has_all_keys = all(key in response for key in expected_keys)
            if has_all_keys:
                self.log_test("Transaction Structure", True, f"Received {response['tokens_received']} tokens")
                return True, response
            else:
                self.log_test("Transaction Structure", False, f"Missing transaction fields")
        
        return False, {}

    def test_get_transactions(self):
        """Test getting transaction history"""
        success, response = self.run_test(
            "Get Transactions",
            "GET",
            "transactions",
            200
        )
        
        if success and isinstance(response, list):
            self.log_test("Transaction History", True, f"Found {len(response)} transactions")
            return True, response
        
        return False, []

    def test_portfolio_with_holdings(self):
        """Test portfolio after making purchases"""
        success, response = self.run_test(
            "Get Portfolio (With Holdings)",
            "GET",
            "portfolio",
            200
        )
        
        if success:
            holdings_count = len(response.get('holdings', []))
            total_value = response.get('total_value', 0)
            total_tokens = response.get('total_tokens', 0)
            
            if holdings_count > 0:
                self.log_test("Portfolio Holdings", True, f"{holdings_count} holdings, ${total_value} total value, {total_tokens} tokens")
            else:
                self.log_test("Portfolio Holdings", False, "No holdings found after purchase")
        
        return success, response

    def test_authentication_required(self):
        """Test that protected endpoints require authentication"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        success, _ = self.run_test(
            "Protected Route (No Auth)",
            "GET",
            "portfolio",
            401
        )
        
        # Restore token
        self.token = original_token
        return success

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting Bond DApp API Tests")
        print("=" * 50)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ Cannot connect to API. Stopping tests.")
            return False
        
        # Test authentication flow
        if not self.test_user_registration():
            print("❌ User registration failed. Stopping tests.")
            return False
        
        if not self.test_user_login():
            print("❌ User login failed. Stopping tests.")
            return False
        
        # Test bond endpoints
        bonds = self.test_get_bonds()
        if bonds:
            self.test_get_single_bond(bonds[0]['id'])
        
        # Test wallet functionality
        wallet_success, initial_balance = self.test_wallet()
        if wallet_success:
            self.test_wallet_topup(25.0)
        
        # Test portfolio (empty)
        self.test_portfolio_empty()
        
        # Test bond purchase
        if bonds:
            purchase_success, transaction = self.test_buy_bond(bonds[0]['id'], 5.0)
            if purchase_success:
                # Test portfolio with holdings
                self.test_portfolio_with_holdings()
                
                # Test transaction history
                self.test_get_transactions()
        
        # Test authentication
        self.test_authentication_required()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = BondDAppAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_api_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
                'timestamp': datetime.now().isoformat()
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())