# Generated by Django 3.0.6 on 2020-06-03 16:11

from django.db import migrations
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('taggit', '0003_taggeditem_add_unique_index'),
        ('algorithms', '0008_algorithm_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='algorithm',
            name='tags',
            field=taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags'),
        ),
    ]
