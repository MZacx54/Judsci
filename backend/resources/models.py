from django.db import models

class Resource(models.Model):
    TYPE_CHOICES = [
        ('ANNUAL_REPORT', 'Annual Report'),
        ('NEWSLETTER', 'Newsletter'),
        ('OTHER', 'Other'),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='ANNUAL_REPORT')
    date = models.DateField()
    description = models.TextField(blank=True, default='')
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='resources/covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        try:
            super().save(*args, **kwargs)
        except Exception:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT column_name FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = 'resources_resource';
                """)
                cols = {row[0] for row in cursor.fetchall()}
                
                col_map = {
                    'title': self.title,
                    'type': self.type,
                    'date': self.date,
                    'description': self.description,
                    'file': str(self.file) if self.file else '',
                    'cover_image': str(self.cover_image) if self.cover_image else '',
                    'is_active': True,
                    'external_link': ''
                }
                
                if self.pk and Resource.objects.filter(pk=self.pk).exists():
                    update_clauses = []
                    params = []
                    for col, val in col_map.items():
                        if col in cols:
                            update_clauses.append(f'"{col}" = %s')
                            params.append(val)
                    params.append(self.pk)
                    sql = f'UPDATE resources_resource SET {", ".join(update_clauses)} WHERE id = %s;'
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
                    sql = f'INSERT INTO resources_resource ({", ".join(insert_cols)}) VALUES ({", ".join(insert_vals)}) RETURNING id;'
                    cursor.execute(sql, params)
                    self.id = cursor.fetchone()[0]

    def __str__(self):
        return self.title
