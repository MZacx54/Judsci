from django.db import models

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('RESCHEDULED', 'Rescheduled'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        try:
            super().save(*args, **kwargs)
        except Exception:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT column_name FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = 'bookings_appointment';
                """)
                cols = {row[0] for row in cursor.fetchall()}
                
                col_map = {
                    'name': self.name,
                    'full_name': self.name,
                    'email': self.email,
                    'phone': self.phone,
                    'date': self.date,
                    'preferred_date': self.date,
                    'time': self.time,
                    'preferred_time': self.time,
                    'reason': self.reason,
                    'service_type': 'General Consultation',
                    'notes': self.reason,
                    'status': self.status
                }
                
                if self.pk and Appointment.objects.filter(pk=self.pk).exists():
                    update_clauses = []
                    params = []
                    for col, val in col_map.items():
                        if col in cols:
                            update_clauses.append(f'"{col}" = %s')
                            params.append(val)
                    params.append(self.pk)
                    sql = f'UPDATE bookings_appointment SET {", ".join(update_clauses)} WHERE id = %s;'
                    cursor.execute(sql, params)
                else:
                    insert_cols = []
                    insert_vals = []
                    params = []
                    for col, val in col_map.items():
                        if col in cols:
                            insert_cols.append(f'"{col}"')
                            insert_vals.append('%s')
                            params.append(val)
                    sql = f'INSERT INTO bookings_appointment ({", ".join(insert_cols)}) VALUES ({", ".join(insert_vals)}) RETURNING id;'
                    cursor.execute(sql, params)
                    self.id = cursor.fetchone()[0]

    def __str__(self):
        return f"{self.name} - {self.date} at {self.time} ({self.status})"
