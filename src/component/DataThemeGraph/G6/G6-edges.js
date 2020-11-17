import G6 from '@antv/g6'

export const dataThemeType = [
  {
    label: '左联',
    value: 'Left join',
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAiCAYAAAAQ9/ptAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDMtMTBUMTU6MzE6MDIrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTI0VDE3OjQ0OjA4KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI0VDE3OjQ0OjA4KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmRiZTQ2MWE4LWNm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'
  },
  {
    label: '右联',
    value: 'Right join',
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAiCAYAAAAQ9/ptAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDMtMTBUMTU6MzE6MDIrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAzLTI0VDE3OjQ1OjMwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI0VDE3OjQ1OjMwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmMwNDNmMDBjLWUy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'
  },
  {
    label: '内联',
    value: 'Inner join',
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAiCAYAAAAQ9/ptAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAa2SURBVHja1JldTFvnGcd/to/Nt43Nyc4CUctHNj7cm6BFykgzHJlITZMu6aJquwB1F0kUCamatM2qukm7WNdNXm9aCSmpyEVGp3XdR6hK2kxABs5CpFxALmIMHcZZJ0xP6xzAfBn72N4FdkoSCPbrqz1XRzrv8/+///Oc933e93kM6XSaE696ycWcSuQbwItAO+AE6oAKwABEgfuAHxgBPvGr8pe7YDwH1ALWzOsoEMpgjO6E8bhdu+J5+CzlKOR5wGOxWF5obm42NzQ0UF1djcPhoLi4GIBYLCZrmiaHw+HvBIPBVwOBgO5UItcBr1+VbzqVyJEtGNIuGAeDweCPA4FAIoPxe78q38xlroanRcipRGqBdx0Ox0sul4vW1lYsFktO0YzH40xMTDA4OEg0Gl2vrKwscbvdHDhwIC+M8fFxRkZG0DRtAHjNr8ohoQg5lcgrkiT1ut1uq8vlwmQykY9ZLBbm578gGl1mcb2oxGxex2w25ywmi3Ho0CEOHjyIz+c7OTg4+D2nEjnnV+UPd/KRdhDzC7vd/uuuri7Dvn37ELFLl94j8FmI/y7ZiCUkHqzp/OGPf+HBA41jxzrywjKZTBw9epTGxkbrlStXPnAS+ZZflX+z3VjjNmJeVxTlze7ubmExly9fZnI6REjbFAMQ0yVCmo2BT4cZHh4Wwq2urqa7u9ugKMqbTiXy+q6CnErkFYfD8daFCxewWq1CpP39H3Fv8t/cX7Chpx79XnrKyP0FGwOfDDIxcVcI32q1cvbsWRwOx1tOJfKjHQU5lcizJpOpt7Oz01BWViZENjsb4tbYbT5ftD4hZquozxet/PVvf0fTNCEem81GV1eXQZKkS04lUrdThN7p6Oiwiv5mAO+/30dktZiY/vRsENMl5jQjV/v7hblqampwu91W4J0nBDmVSJvdbj/V3t4uTDA2NsbC0hpfrZbkND6yVso9/2fMhkLCnO3t7djt9pc8Hs/hxyP0M5fLhSRJwuDDw8NE1kpIpw05jU+nN0X5RkeFOSVJwuVyAfz0oSCPxyObzeYTra2twsBfqCpL0RUW14vz8ltcL2IyMM3yyoowdybZn/R4PHuyEXqhqanJUlRUJAz6r5s3WdmwkMoxOllLpQ1EYyampqaEuYuKimhsbDQD388KcjU0NFCIzQRnWY2bhXxX42Zmg6GC+Pfv3w9wOCuoZe/evQUBrixHWdfF1l8sIaGq8wXxZ+bfkhVUV1VVVRBgPK6TSBrFfJMmFhYWCuJ3OBxkrjIYgYrs8V3cUiTzXD9ZS6aMrK2tFcSemX/Ftme5/3czAsuxWKxgGJMhLeRpMqYoLS0tiD0z/+WsoJDomerre4uE2ZQS8zUlsdvtBfFn5h/KCgqEw+GCAMsrrJRIutj/b9ZRlMJ22fn5eYDJrKB/BoPBwvJAQz1lloSQb5klQX1DXWF5cGYG4FZW0D+mpqYSGxsbwoDPHzlCeVEcY57ryGhIYy1O0tTUJMy9sbHB9PR0AvgYwOj1er9KJBID4+PjwqDfVBRs1nIqS/L7KJUlGzQ3N1JRXi7MPTExQTwev+b1er/cum2/PTIygq7rwsButxu5dA1DjlEyGEAuXaOQK4uu64yMjAC8/cj1wa/KYwsLCx+NFnCUb2trw24rRS5dz2m8XLrGc85vU18nvn58Ph+apg14vd5b291YfzI0NBSdm5sTJujs7GJPeYziXXa8YkmnxpHi9KnTwlxzc3MMDQ0tA69tewX3q/L9ZDJ5rq+vL726uipEUl9fx+G27/JMZRTJuH1ekowpnqmMcuYHL1NV5RDiWVpaoq+vD13Xzz9eeHzk6ONX5Q81TXvj4sWLRKNRIbLTp0/R3NhArX3pCVGSMUWtfYkXjx+jtfWAEP7y8jK9vb1omvaGX5U/2LUu51fl36mq+suenp60aMI9f/4cLY111DmWHv5+xZJOnWOJk8fdHOtwC+GGw2F6enpQVfVXflX+7babzU61bacS+aEkSe91dHRY29vb8y4FA1y92s/t27dZXC9ijzXNmTMvI3LVTyaT+Hw+BgcHo7quX/Cr8p+2vs+ptu1X5T87lcid69evv3vnzp2T+RbrE4kENTXVWK0VQHS9rKyyRNd14vF4XsX6u3fvcuPGDTRNu8ZmsX72qekgl/5QphXy863tlJqamsdbIWiaRjgcJhgMMjk5mYzH45+y2QrxbWmnHG9paTHt0E55iDEzM0MgENC3YOzYTtkaIYNgw8vFZsOrFrBlNx/gP8A9wAdc86uyugPGCb5ueD27A8ZoBiOvhtf/BgAsztUGhy6xTwAAAABJRU5ErkJggg=='
  },
  {
    label: '完全连接',
    value: 'Full join',
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAiCAYAAAAQ9/ptAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAYwSURBVHjaxJlbbFxXFYa/c87kzM2T8WQG28Exrmuc1NgugUCSNmrtBJTWdiUkClIbpUAfUAtSy0u6eUFBQfDAiXiglZAsIUUg0idUqVJsp4XcnKZNUhKi2u7V8QXH2GN5OrHnPpkzmwePm8SMXXufCNajvdb/73/22XutvZYmpWStJoSoArqAdqAVuA/YWPr3AjAODAHngJPD0cjMcoyW6rkljA6g5Q4MCSSAMWC4hNE3HI3MLsfo/ZNYcY3aWgQJIR4BRFFqjydypiuV30C24OKWrWNLDQBDk2wwinhcBfzmLQLuvK1rsh+whqOR8y3Vc+3AoaLUOhM507gbQwdkOYxbuiZPAkeHo5HzjgUJIe4HXs7bRvdcyst81k2xJODzTNckQU+OplqTh3Z9PfP2pavekam8EkbEn8E07BPAi8PRyNhqgvRVxByQUrsWTfq7R2Ih4hnPmhcCUJQaX2tr4ofPPE2yUOH9wcEDbN3WvG6MeMbDSCxENOl/QkrtWkv13FOrxZTdISHE4bxtHJm8GSBbcKFiT3U2s/3BZv7wl7P8a+pT6mvD/ORgO2/9Y4QTp95TwvS4CtRVJjAN+5eWZf1qTYKEEIdzBePIeDxIoagrEX//sQdoa9nK7/74N+YXMp/9PbjRy6Ef7+fi1VF6zwwqYbv0IveF5nG77F9YlvWbVT85IcSBvO1MzN5vbmHnjlaO9rx5lxiA+YUMR3veYO9D29i1vUEJv1DUGY8HydvGr4UQT68oSAjRKKXWM3kzoCymJuzlySf28PKxUyRS2bI+C8ksvz92igPf2Um40q8savJmACm1HiFEw0o79MpsylehemYAnv3eLt4Y+IDJ6fiqfpPTcf5+4UOe+e5uZa5swcVsyhcAXvkvQUKIR/O20RlLeZUJHmwKEwqF6Ts7tCb//jOD1FZX8uX6KmXOWNpL3ja6S3nyrh36+VzKi0Tduve10n9uCNsuru2zsYv0nx2ie1+bMqeUMLe4CYc+EySEqClKbf981q0MHAqY1G2p5e0r19cVd+HKdbY2VFPhV+cuJequUlmGDnQlcqZrPQlvue3+ai2DH02RyxfWFZfLF3h/5N/saK1X5i5KjWTOdJXqQ3SgPZXfgBPben81H16fUYr9YGSGpoYqR/yl9XcsCWpxcrMBbK4OMzEVU4qduBGjbvMmR/zZgkGpckcHGvK27ggwuDHA7FxCKXY2lmBT0O+IP28bAA1LgjYWpTNBbrebZDqnFJtMZ/H7TEf8pSdMYNVqe12AdhGXy1CrzQyDQqHIvTIdWNA1Z4CZbA6fR+1X9nlNUpmcI35Dk5Reu+jAuGk4E5ROp4hsUjsHkVAFC8msI/7S+seXBA15XAVHgNPRGPW1YaXY+i1hJqc/dcRfWv/QkqABv3nLEeDHo1EeaKxRim1urOGTsVlH/L7F9Z9bEtQbcOcLuqZeyV18b4q2bbWYG9aXz9ymi680fZErQxPql4AmCbjzBaAPQLcsa0bX5JtBj/rBjC/kmbwxxZ5vNK4rbs+ORj4ei5JMqXMHPTl0TZ60LCt657X924g/g+Zg20+cHqKzvRXDWFsmcBk6j3e00nt6UJlT0yDizwBYdz0fLMsaMA27P+zPKIMPfhIjHo/R1dG6Jv/OvW1MR+cZmVA/P2FfBtOw+yzLOl/uxfrCF/zppJMb79hfL7H/kWbqNodW9avbHOLbe5r582vvOLrZqvzpBPBC2Se4ZVnXdU0+X1eZwKWr5aWZWIbXei/w4o/2EfB7yvoE/B5+9uy3OP76JWI3U8qdn7rKBJomn7csa3TFro9lWcdNwz5SH1pQFnXm3RtcvjrMS8/tJxjwLitivYjnHuP0Ox9x+dqYozaWadiHLct69f/WaPxS7SZ+erDjf99ovLNHJ6XWM5vyVcTSXqRCmtq3s44nux/m6vtTbG/ewvHXL3Pxn6NKt1nYl6HKn06UPrNXV/T9nGZ9I4vN+i4nzfqHd+/IXLh4xWmzvpfFZv3ovRinPAq8VHYUUmpKGnpx+SikqGuyj8VRyMCq45SVMQqlkcy9GaeUEVYFdHN74FUPBJcaMMBEqUgcAPqHo5Hp5Rgt1XM13B6atZTBGOf2wKt3vQOv/wwA+AfrMjn0RhMAAAAASUVORK5CYII='
  }
]

const EdgeDataTheme = (vm) => {
  G6.registerEdge(
    'edge-data-theme',
    {
      afterDraw (cfg, group) {
        // console.log('cfg', cfg, group)
        // 获取图形组中的第一个图形，在这里就是边的路径图形
        const shape = group.get('children')[0]
        const nodeWidth = 200
        const sourceNode = vm.graph.findById(cfg.source)
        const targetNode = vm.graph.findById(cfg.target)
        const sourceNodeBox = sourceNode.getBBox()
        const targetNodeBox = targetNode.getBBox()
        const sourceX = sourceNodeBox.x
        const targetX = targetNodeBox.x
        const startPoint = cfg.startPoint
        const endPoint = cfg.endPoint
        // 判断起点何时在左边
        const startInLeft =
          targetX - sourceX > 0
            ? targetX - sourceX - nodeWidth < 100
            : sourceX - targetX - nodeWidth > 100
        const endInLeft = targetX - sourceX > 0
        const currentStartPoint = {
          x: startInLeft ? sourceX : sourceX + nodeWidth,
          y: startPoint.y
        }
        const currentEndPoint = {
          x: endInLeft ? targetX : targetX + nodeWidth,
          y: endPoint.y
        }
        const LPointX = startInLeft
          ? endInLeft
            ? currentStartPoint.x - 100
            : currentStartPoint.x - 20
          : endInLeft
            ? currentStartPoint.x + 20
            : currentStartPoint.x + 100
        shape.attr({
          stroke: cfg.isError ? '#ad1b1b' : '#c0c0c0',
          lineWidth: 2,
          path: [
            ['M', currentStartPoint.x, currentStartPoint.y],
            [
              'L',
              LPointX,
              currentStartPoint.y
            ],
            [
              'L',
              LPointX,
              currentEndPoint.y
            ], // 三分之二处
            ['L', currentEndPoint.x, currentEndPoint.y]
          ]
        })
        // 绘制连接关系图形
        const op = cfg.op
        const currentCenterImg = dataThemeType.find((e) => e.value === op)
        const imgWidth = 52 * 0.7
        const imgHeight = 34 * 0.7
        const imageShape = group.addShape('image', {
          attrs: {
            img: currentCenterImg ? currentCenterImg.image : '',
            cursor: 'pointer',
            width: imgWidth,
            height: imgHeight,
            x: endInLeft ? currentEndPoint.x - 52 : currentEndPoint.x + 52,
            y: currentEndPoint.y - imgHeight / 2
          },
          name: 'imageShape'
        })
        const imageShapeBox = imageShape.getBBox()
        if (cfg.isError) {
          group.addShape('image', {
            attrs: {
              img: require('./close.png'),
              cursor: 'pointer',
              width: 15,
              height: 15,
              x: imageShapeBox.x - 18,
              y: imageShapeBox.y + 3
            }
          })
        }

        group.addShape('text', {
          attrs: {
            text: '配置',
            fill: cfg.isError ? '#ad1b1b' : '#4a5e89',
            fontSize: 14,
            opacity: 0,
            x: endInLeft ? imageShapeBox.x + 5 : imageShapeBox.x - 5,
            y: imageShapeBox.y + 40,
            cursor: 'pointer'
          },
          name: 'option'
        })
      },
      setState (name, value, item) {
        const group = item.getContainer()
        const sourceNode = item.getSource()
        const targetNode = item.getTarget()
        const children = group.get('children')
        const edge = children[0]
        const cfg = item._cfg.model
        // const leftSvg = children.find(e => e.cfg.name === 'leftCircle')
        // const rigthSvg = children.find(e => e.cfg.name === 'rightCircle')
        const textSvg = children.find((e) => e.cfg.name === 'option')
        if (name === 'hover') {
          edge.attr({
            stroke: value ? '#c0c0c0' : cfg.isError ? '#ad1b1b' : '#c0c0c0'
          })
          textSvg.attr({
            opacity: value ? 1 : 0
          })
          // leftSvg.attrs.fill = value ? '#eaeaea' : '#fff'
          // rigthSvg.attrs.fill = value ? '#8a9eca' : '#4a5e89'
          // 同步执行节点的hover事件
          vm.graph.setItemState(sourceNode, 'hover', value)
          vm.graph.setItemState(targetNode, 'hover', value)
        }
        if (name === 'click') {
          if (value) vm.edgesOpera('click', item)
        }
      },
      update: undefined
    },
    'polyline'
  )
}
export const registerEdge = (vm) => {
  EdgeDataTheme(vm)
}
