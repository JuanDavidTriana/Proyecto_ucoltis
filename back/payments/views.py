from rest_framework import status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from account.models import Model, OrderModel
from rest_framework.decorators import permission_classes
from datetime import datetime


def save_card_in_db(cardData, email, cardId, customer_id, user):
    # save card in django stripe model
    Model.objects.create(
        email=email,
        customer_id=customer_id,
        card_number=cardData["number"],
        exp_month=cardData["exp_month"],
        exp_year=cardData["exp_year"],
        card_id=cardId,
        user=user,
    )


class TestImplementation(APIView):
    def post(self, request):
        test_payment_process = {
            "amount": 120,
            "currency": 'inr',
            "receipt_email": 'yash@gmail.com'
        }
        return Response(data=test_payment_process, status=status.HTTP_200_OK)


class CheckTokenValidation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response("Token is Valid", status=status.HTTP_200_OK)


class CreateCardTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        card_invalid = False
        data = request.data
        email = request.data["email"]
        cardStatus = request.data["save_card"]

        # Dummy card validation logic
        if not data["number"].isdigit() or len(data["number"]) != 16:
            return Response({"detail": "Invalid Card Number"}, status=status.HTTP_400_BAD_REQUEST)

        # Simulating card creation and token generation
        stripeToken = {
            "id": "dummy_token",
            "card": {
                "number": data["number"],
                "exp_month": data["exp_month"],
                "exp_year": data["exp_year"],
                "cvc": data["cvc"]
            }
        }

        # Dummy customer creation/retrieval
        customer = {
            "id": "dummy_customer_id",
            "sources": {
                "data": [
                    {
                        "last4": data["number"][-4:],
                        "exp_month": data["exp_month"],
                        "exp_year": data["exp_year"]
                    }
                ]
            }
        }

        if cardStatus:
            try:
                save_card_in_db(data, email, stripeToken["id"], customer["id"], request.user)
                message = {"customer_id": customer["id"], "email": email, "card_data": stripeToken}
                return Response(message, status=status.HTTP_200_OK)
            except:
                return Response({
                    "detail": "Card already in use, please uncheck save card option or select a card from saved card list."
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                message = {"customer_id": customer["id"], "email": email, "card_data": stripeToken}
                return Response(message, status=status.HTTP_200_OK)
            except:
                return Response({"detail": "Network Error, please check your internet connection."})


# Charge the customer card
class ChargeCustomerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data

            # Guardar la orden en la base de datos de Django
            new_order = OrderModel.objects.create(
                name=data.get("name"),
                card_number=data.get("card_number"),
                address=data.get("address"),
                ordered_item=data.get("ordered_item"),
                paid_status=data.get("paid_status"),
                paid_at=datetime.now(),
                total_price=data.get("total_price"),
                is_delivered=data.get("is_delivered"),
                delivered_at=data.get("delivered_at"),
                user=request.user
            )

            return Response(
                data={
                    "message": "Order created successfully",
                    "order_id": new_order.id
                },
                status=status.HTTP_200_OK
            )

        except KeyError as e:
            return Response({
                "detail": f"Missing field: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "detail": f"An error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class RetrieveCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        card_details = {
            "customer_id": request.headers["Customer-Id"],
            "card_id": request.headers["Card-Id"],
            "last4": "1234",
            "exp_month": "12",
            "exp_year": "2025"
        }
        return Response(card_details, status=status.HTTP_200_OK)


class CardUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data

        # Dummy update card logic
        update_card = {
            "customer_id": data["customer_id"],
            "card_id": data["card_id"],
            "exp_month": data["exp_month"],
            "exp_year": data["exp_year"],
            "name": data["name_on_card"]
        }

        # locating stripe object in django database
        obj = Model.objects.get(card_number=request.data["card_number"])

        # updating stripe object in django database
        if obj:
            obj.name_on_card = data["name_on_card"] if data["name_on_card"] else obj.name_on_card
            obj.exp_month = data["exp_month"] if data["exp_month"] else obj.exp_month
            obj.exp_year = data["exp_year"] if data["exp_year"] else obj.exp_year
            obj.address_city = data["address_city"] if data["address_city"] else obj.address_city
            obj.address_country = data["address_country"] if data["address_country"] else obj.address_country
            obj.address_state = data["address_state"] if data["address_state"] else obj.address_state
            obj.address_zip = data["address_zip"] if data["address_zip"] else obj.address_zip
            obj.save()
        else:
            pass

        return Response({
            "detail": "card updated successfully",
            "data": {"Updated Card": update_card},
        }, status=status.HTTP_200_OK)


class DeleteCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        obj_card = Model.objects.get(card_number=request.data["card_number"])

        customerId = obj_card.customer_id
        cardId = obj_card.card_id

        # Deleting card from django database
        obj_card.delete()

        # Dummy customer deletion logic
        # No actual customer deletion, just a placeholder

        return Response("Card deleted successfully.", status=status.HTTP_200_OK)
