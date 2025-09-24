from django import template

register = template.Library()

@register.filter
def is_image(filename):
    if not filename:
        return False
    filename = filename.lower()
    return filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png') or filename.endswith('.gif')



# add this at top of ur html code 
# {% load chat_extras %}