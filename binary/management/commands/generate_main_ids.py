from django.core.management.base import BaseCommand
from userprofile.models import UserRegistration
import random
import string
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generates main_id for existing users who do not have one.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to generate main_id for existing users...'))

        # Get all users with no main_id
        users_to_update = UserRegistration.objects.filter(main_id__isnull=True)
        total_users = users_to_update.count()
        self.stdout.write(f'Found {total_users} users to update.')

        if total_users == 0:
            self.stdout.write(self.style.SUCCESS('No users found without a main_id. Exiting.'))
            return

        updated_count = 0
        for user in users_to_update:
            while True:
                prefix = "TRD"
                suffix = "FX"
                random_digits = ''.join(random.choices(string.digits, k=10))
                new_id = f"{prefix}{random_digits}{suffix}"
                
                # Check for uniqueness to avoid collisions
                if not UserRegistration.objects.filter(main_id=new_id).exists():
                    user.main_id = new_id
                    user.save(update_fields=['main_id'])  # Use update_fields for efficiency
                    updated_count += 1
                    break

        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} users.'))




        # yourapp/management/commands/generate_main_ids.py

        # python manage.py generate_main_ids